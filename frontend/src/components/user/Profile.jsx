import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import { FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            navigate("/");

            return;
        }

        axios.get('https://dailydigest-backend-1.onrender.com/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    password: '',
                });
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                setError('Failed to fetch profile information');
                setLoading(false);
            });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        const token = localStorage.getItem('token');
        const updateData = {
            username: formData.username,
            email: formData.email,
        };

        const isPasswordChanged = formData.password !== '';
        const isUsernameChanged = formData.username !== user.username;
        const isEmailChanged = formData.email !== user.email;

        if (!isPasswordChanged && !isUsernameChanged && !isEmailChanged) {
            toast.error("Nothing is changed");
            return;
        }

        if (isPasswordChanged && user.password !== oldPassword) {
            toast.error("Old password is not correct");
            return;
        }

        if (isPasswordChanged) {
            updateData.password = formData.password;
        }

        axios.put(`https://dailydigest-backend-1.onrender.com/users/${user._id}`, updateData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    email: response.data.email,
                    password: '',
                });
                setOldPassword("");
                toast.success('Profile updated successfully');
                window.location.reload();
                setEditMode(false);
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error('Failed to update profile');
                }
            });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-600">Error: {error}</div>;
    }

    return (
        <div className="flex">
            <UserSidebar />

            <div className="flex-1 p-6 rounded-lg w-full max-w-2xl mx-auto mt-10">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Profile</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {!editMode ? (
                        <>
                            <div className="mb-4">
                                <strong className="block text-gray-600">Username:</strong>
                                <span className="block text-gray-800">{user.username}</span>
                            </div>
                            <div className="mb-4">
                                <strong className="block text-gray-600">Email:</strong>
                                <span className="block text-gray-800">{user.email}</span>
                            </div>

                            <button
                                className="flex items-center text-blue-500 hover:underline"
                                onClick={() => setEditMode(true)}
                            >
                                <FaEdit className="mr-2" /> Edit
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-600">Username:</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600">Old Password:</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600">New Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="block w-full p-2 border border-gray-300 rounded"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;


