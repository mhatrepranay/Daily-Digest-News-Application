import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../loader/loader';
import AdminSidebar from '../Sidebar/AdminSidebar';
import Modal from '../Reuse components/MOdal';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import "./mange.css"
import { IoMdSearch } from 'react-icons/io';

const UserList = ({ dashboard }) => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);
    const [roleUpdates, setRoleUpdates] = useState({});
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [roleFilter, setRoleFilter] = useState('All'); // State for role filter
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://dailydigest-backend-1.onrender.com/');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleRoleChange = (newRole) => {
        setRoleUpdates(prevRoleUpdates => ({
            ...prevRoleUpdates,
            [editingUser._id]: newRole
        }));
    };

    const updateUserRole = async () => {
        try {
            const role = roleUpdates[editingUser._id] || 'User';
            if (!role) {
                toast.error("Select a role first");
                return;
            }

            await axios.put(`https://dailydigest-backend-1.onrender.com/users/${editingUser._id}/role`, { role });
            fetchUsers();
            setLoading(false);
            setEditingUser(null);
            localStorage.setItem('lastUserRoleUpdate', Date.now());
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    // Filter users based on role and search term
    const filteredUsers = users.filter(user => {
        if (roleFilter !== 'All' && user.role !== roleFilter) {
            return false;
        }
        if (searchTerm === '') {
            return true;
        }
        const normalizedSearch = searchTerm.toLowerCase();
        return (
            user.username.toLowerCase().includes(normalizedSearch) ||
            user.email.toLowerCase().includes(normalizedSearch) ||
            user.role.toLowerCase().includes(normalizedSearch)
        );
    });

    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleRoleFilterChange = (selectedRole) => {
        setRoleFilter(selectedRole);
        setCurrentPage(1); // Reset to first page when changing filters
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page when changing search term
    };

    // Function to highlight search term in text
    const highlightText = (text, highlight) => {
        // If highlight term is empty, return original text
        if (!highlight.trim()) {
            return text;
        }

        // Split text into parts matching highlight term
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? <span key={index} className="bg-yellow-200">{part}</span> : part
        );
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className={`flex ${dashboard ? 'flex-col ' : ''}`}>
                    {!dashboard && <AdminSidebar />}
                    <Link to={dashboard ? "/user-list" : "#"} className={`flex flex-1 cursor-pointer  ${dashboard ? "" : "items-center"}  justify-center overflow-auto hide1`}>
                        <div className={`mx-auto p-4 ${dashboard ? 'w-full' : 'w-[80%]'}   `}>
                            <h2 className="text-3xl text-white font-semibold mb-4">Users</h2>
                            <div className={`${dashboard ? 'h-[300px] overflow-y-auto' : ''}  `}>
                                {/* Role Filter Buttons */}
                                {
                                    !dashboard &&
                                    <div className='sticky top0'>

                                        <div className="  sticky flex justify-center    bg-white z-10">
                                            <button
                                                onClick={() => handleRoleFilterChange('All')}
                                                className={`px-4 py-2 mx-1 border rounded ${roleFilter === 'All' ? 'bg-[#57619e] text-white' : 'hover:bg-gray-400'}`}
                                            >
                                                All
                                            </button>

                                            <button
                                                onClick={() => handleRoleFilterChange('Creator')}
                                                className={`px-4 py-2 mx-1 border rounded ${roleFilter === 'Creator' ? 'bg-[#57619e] text-white' : 'hover:bg-gray-400'}`}
                                            >
                                                Creator
                                            </button>
                                            <button
                                                onClick={() => handleRoleFilterChange('User')}
                                                className={`px-4 py-2 mx-1 border rounded ${roleFilter === 'User' ? 'bg-[#57619e] text-white' : 'hover:bg-gray-400'}`}
                                            >
                                                User
                                            </button>

                                            <input
                                                type="text"
                                                placeholder="Search by username, email, or role"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                className="border rounded px-3 ml-3 py-2"
                                            />


                                        </div>
                                    </div>
                                }

                                {/* Search Input */}
                                <div className=' '>

                                    <table className={`    min-w-full ${dashboard ? "bg-[#e9e9eab0]" : "bg-white"} `}>
                                        <thead>
                                            <tr className={`w-full ${dashboard ? "bg-[#fffa]" : "bg-[#dcd7d7]"} text-left border-b`}>
                                                <th className="px-4 py-2">Username</th>
                                                <th className="px-4 py-2">Email</th>
                                                <th className="px-4 py-2">Role</th>
                                                {
                                                    !dashboard && <th className="px-4 py-2">Actions</th>
                                                }

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(dashboard ? filteredUsers : currentUsers).map(user => (
                                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-2">{highlightText(user.username, searchTerm)}</td>
                                                    <td className="px-4 py-2">{highlightText(user.email, searchTerm)}</td>
                                                    <td className="px-4 py-2">{highlightText(user.role, searchTerm)}</td>
                                                    {
                                                        !dashboard && <td className="px-4 py-2">
                                                            <button
                                                                onClick={() => setEditingUser(user)}
                                                                className="bg-[#57619e] text-white px-4 py-1 rounded hover:bg-gray-600"
                                                            >
                                                                Update
                                                            </button>
                                                        </td>
                                                    }

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                            {!dashboard && (
                                <div className="flex justify-center mt-4">
                                    {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => paginate(index + 1)}
                                            className={`px-4 py-2 mx-1 border rounded ${currentPage === index + 1 ? 'bg-[#57619e] text-white' : 'bg-white'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Link>
                </div >
            )}
            {
                editingUser && (
                    <Modal onClose={() => setEditingUser(null)}>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-4">Update Role</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    value={editingUser.username}
                                    disabled
                                    className="border rounded w-full px-3 py-2 mt-1"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    value={roleUpdates[editingUser._id] || editingUser.role || 'User'}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    className="border rounded w-full px-3 py-2 mt-1"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Creator">Creator</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => updateUserRole()}
                                    className="bg-[#57619e] text-white px-4 py-2 rounded hover:bg-gray-800"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </>
    );
};

export default UserList;
