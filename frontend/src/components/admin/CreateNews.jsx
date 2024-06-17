import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import useLoggedInUser from '../customhook/loginUserData';
import AdminSidebar from './Sidebar/AdminSidebar';
import UserSidebar from '../user/UserSidebar';
import Loader from '../loader/loader';

const ArticleForm = () => {
    const user = useLoggedInUser(); // Initialize user state

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://dailydigest-backend-1.onrender.com/api/categories');
            setCategories(response.data);
            console.log(response)
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories. Please try again.');
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const selectCategory = (selectedCategory) => {
        setCategory(selectedCategory);
        setDropdownVisible(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !content || !author || !category || !image) {
            toast.error('Please fill in all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', author);
        formData.append('category', category);
        formData.append('image', image);

        if (user) {
            formData.append('user', JSON.stringify(user));
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('https://dailydigest-backend-1.onrender.com/api/articles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            setTitle('');
            setContent('');
            setAuthor('');
            setCategory('');
            setImage(null);
            setImagePreview(null);
            document.getElementById('image').value = null;

            toast.success('Article uploaded successfully!');

            localStorage.setItem('lastArticleAddedTime', Date.now());
        } catch (error) {
            console.error('Error uploading article:', error);
            toast.error('Error uploading article. Please try again.');
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    return (
        <div className="flex">
            {!user ? <Loader /> : user.role === 'Admin' ? <AdminSidebar /> : <UserSidebar />}

            <div className="flex-1 h-screen overflow-auto bg-transparent flex flex-col items-center pt-10">
                <div className="bg-transparent p-8 rounded-lg shadow-lg w-full max-w-[45rem] ">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Upload New Article</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-white text-[20px] font-bold">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ borderBottom: '2px solid black' }}
                                className="w-full mt-2 p-3 bg-transparent text-white placeholder-black rounded-md focus:outline-none focus:ring-[#ffffff00]"
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-white text-[20px] font-bold">
                                Content
                            </label>
                            <textarea
                                id="content"
                                placeholder="Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{ borderBottom: '2px solid black' }}
                                className="w-full mt-2 p-3 bg-transparent text-white placeholder-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffffff00]"
                                rows="6"
                            />
                        </div>

                        <div>
                            <label htmlFor="author" className="block text-white text-[20px] font-bold">
                                Author
                            </label>
                            <input
                                type="text"
                                id="author"

                                placeholder="Author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                style={{ borderBottom: '2px solid black' }}
                                className=" w-full mt-2 p-3 bg-transparent text-white placeholder-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffffff00]"
                            />
                        </div>
                        <div>
                            <div className="relative">
                                <label
                                    htmlFor="category"
                                    className="block text-white text-[20px] font-bold cursor-pointer"
                                >
                                    Category
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    autocomplete="off"
                                    placeholder="Category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    onClick={toggleDropdown}
                                    style={{ borderBottom: '2px solid black' }}
                                    className=" w-full mt-2 p-3 bg-transparent text-white placeholder-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffffff00] cursor-pointer"
                                />
                                {dropdownVisible && (
                                    <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg py-1 overflow-auto max-h-40">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat._id}
                                                onClick={() => selectCategory(cat)}
                                                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-white text-[20px] font-bold">
                                Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                style={{ borderBottom: '2px solid black' }}
                                className="w-full mt-2 p-3 bg-transparent text-black placeholder-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffffff00]"
                            />
                            {imagePreview && (
                                <div className="mt-4">
                                    <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-md" />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold transition duration-200"
                        >
                            Upload Article
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArticleForm;
