import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useLoggedInUser from '../customhook/loginUserData';
import UserSidebar from '../user/UserSidebar';
import AdminSidebar from './Sidebar/AdminSidebar';

const UpdateArticleForm = () => {
    const { id } = useParams(); // Get the article ID from the URL
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null); // State for current image
    const navigate = useNavigate();
    const fileInputRef = useRef();
    const user = useLoggedInUser();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`https://dailydigest-backend-1.onrender.com/api/articles/${id}`);
                const { title, content, author, image, category } = response.data;
                setTitle(title);
                setContent(content);
                setAuthor(author);
                setCategory(category);
                if (image) {
                    setCurrentImage(`data:${image.contentType};base64,${arrayBufferToBase64(image.data.data)}`);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };

        fetchArticle();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', author);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.put(`https://dailydigest-backend-1.onrender.com/api/articles/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (user.role === "Admin") {
                navigate("/articles");
            } else {
                navigate("/user-articles");
            } // Redirect to home or article list after update
            localStorage.setItem('lastArticleUpdate', Date.now());
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setCurrentImage(URL.createObjectURL(file));
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // Helper function to convert ArrayBuffer to base64
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    return (
        <div className="flex">
            {
                !user ? (
                    <div className="">Loading....</div>
                ) : (
                    user.role === "Admin" ? <AdminSidebar /> : <UserSidebar />
                )
            }
            <div className="flex-1 max-w-3xl mx-auto mt-8 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Update Article</h2>
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-400">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-700 text-white border-b-2 border-gray-600 py-1 px-3 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-gray-400">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-gray-700 text-white border-b-2 border-gray-600 py-1 px-3 rounded"
                            rows="6"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="author" className="block text-gray-400">Author</label>
                        <input
                            type="text"
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full bg-gray-700 text-white border-b-2 border-gray-600 py-1 px-3 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="author" className="block text-gray-400">Category</label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-gray-700 text-white border-b-2 border-gray-600 py-1 px-3 rounded"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="image" className="block text-gray-400">Image</label>
                        {currentImage && (
                            <div className="relative">
                                <img
                                    src={currentImage}
                                    alt="Current Article"
                                    className="w-full h-auto object-cover cursor-pointer"
                                    onClick={handleImageClick}
                                />
                                <input
                                    type="file"
                                    id="image"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="absolute bottom-0 right-0 opacity-0 w-full h-full cursor-pointer"
                                    style={{ height: 'auto', width: 'auto' }}
                                />
                            </div>
                        )}
                        <div className="mt-4">
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="bg-gray-700 text-white border-b-2 border-gray-600 py-1 px-3 rounded"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                    >
                        Update Article
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateArticleForm;
