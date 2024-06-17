import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../loader/loader';
import './user.css'; // Import your custom styles here
import { AiTwotoneDislike, AiTwotoneLike } from 'react-icons/ai';
import { FaMicrophone } from 'react-icons/fa'; // Import microphone icon
import { IoMdMenu } from 'react-icons/io'; // Import menu icon
import useLoggedInUser from '../customhook/loginUserData';
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import UserSidebar from './UserSidebar';


const UserArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [voiceSearching, setVoiceSearching] = useState(false);
    const [sortBy, setSortBy] = useState('date'); // Default sorting by date
    const [sortOrder, setSortOrder] = useState('desc'); // Default descending order
    const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
    const [articleToDelete, setArticleToDelete] = useState(null); // State for article to be deleted
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal

    const user = useLoggedInUser();

    useEffect(() => {
        const fetchArticlesAndCategories = async () => {
            try {
                const articlesResponse = await axios.get('https://dailydigest-backend-1.onrender.com/api/articles');
                setArticles(articlesResponse.data);

                const categoriesResponse = await axios.get('https://dailydigest-backend-1.onrender.com/api/categories');
                setCategories(['All', ...categoriesResponse.data]); // Adding 'All' to the categories list

                setLoading(false);
            } catch (error) {
                console.error('Error fetching articles and categories:', error);
                setLoading(false);
            }
        };

        fetchArticlesAndCategories();
    }, []);

    const calculatePopularity = (article) => {
        return article.likes;
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const generateMarginTopClass = (index) => {
        if (index % 2 === 0) {
            return 'p-4';
        } else if (index % 5 === 0) {
            return 'mt-5 p-2'; // Adjusted margin-top for better spacing
        } else {
            return 'mt-10 p-2';
        }
    };

    const truncateContent = (content) => {
        const words = content.split(' ');
        if (words.length > 20) {
            return words.slice(0, 20).join(' ') + '...';
        } else {
            return content;
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
        setVoiceSearching(false); // Disable voice search when typing manually
    };

    const handleVoiceSearch = () => {
        setVoiceSearching(true);

        // Simulating voice search - replace with actual SpeechRecognition API usage
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchTerm(transcript);
            searchArticles(transcript.trim());
        };

        recognition.onend = () => {
            setVoiceSearching(false);
        };

        recognition.start();
    };
    const userArticles = articles.filter(article => article.user._id === user._id);


    const searchArticles = (searchQuery) => {
        let filteredArticles = userArticles.filter(article => article.category === selectedCategory || selectedCategory === 'All');

        filteredArticles = filteredArticles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortBy === 'date') {
            filteredArticles.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
        } else if (sortBy === 'popularity') {
            filteredArticles.sort((a, b) => {
                const popularityA = calculatePopularity(a);
                const popularityB = calculatePopularity(b);
                return sortOrder === 'asc' ? popularityA - popularityB : popularityB - popularityA;
            });
        }

        return filteredArticles;
    };


    const filteredArticles = searchArticles(searchTerm);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleSortOrderAsc = () => {
        setSortOrder('asc');
    };

    const handleSortOrderDesc = () => {
        setSortOrder('desc');
    };

    const handleSortByDate = () => {
        setSortBy('date');
        setSortOrder('desc');
    };

    const handleSortByPopularity = () => {
        setSortBy('popularity');
        setSortOrder('desc');
    };


    const handleDeleteArticle = async () => {
        try {
            await axios.delete(`https://dailydigest-backend-1.onrender.com/api/articles/${articleToDelete}`);
            // Filter out the deleted article from the state
            setArticles(articles.filter(article => article._id !== articleToDelete));
            setShowDeleteModal(false); // Close the modal
            setArticleToDelete(null); // Reset the article to delete
        } catch (error) {
            console.error('Error deleting article:', error);
            setShowDeleteModal(false); // Close the modal
            setArticleToDelete(null); // Reset the article to delete
        }
    };

    const DropdownMenu = () => {
        // Calculate position dynamically based on the button position
        const dropdownStyle = {
            position: 'absolute',
            top: 'calc(100% - 70px)', // Adjust the distance from the button as needed
            zIndex: 1000, // Ensure it's above other elements
            backgroundColor: '#gray',
            minWidth: '160px',
            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
            borderRadius: '4px',
            display: dropdownVisible ? 'block' : 'none', // Show only when dropdownVisible is true
        };

        return (
            <div className="dropdown-content" style={dropdownStyle}>
                <div className="cursor-pointer flex items-center" onClick={handleSortByDate}>
                    <span className='mr-4'>Date</span>
                    {sortBy === 'date' && (
                        <>
                            {sortOrder === 'asc' ? (
                                <FaArrowUpLong onClick={handleSortOrderDesc} />
                            ) : (
                                <FaArrowDownLong onClick={handleSortOrderAsc} />
                            )}
                        </>
                    )}
                </div>
                <div className="cursor-pointer flex items-center" onClick={handleSortByPopularity}>
                    <span className='mr-4'>Popularity</span>
                    {sortBy === 'popularity' && (
                        <>
                            {sortOrder === 'asc' ? (
                                <FaArrowUpLong onClick={handleSortOrderDesc} />
                            ) : (
                                <FaArrowDownLong onClick={handleSortOrderAsc} />
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="flex">
                    <UserSidebar />
                    <div className="flex-1 overflow-auto h-screen hide1 ml-3">
                        <div className="sticky top-0 z-10 rounded-lg bg-white shadow-md pl-[20vh] pt-2">
                            <div className="flex items-center justify-between mb-4 overflow-x-auto">
                                {/* <div className="dropdown relative flex mb-1">
                                    <span className="mt-[0.6rem]">Sort By</span>
                                    <button
                                        className="dropdown-btn"
                                        onClick={toggleDropdown}
                                    >
                                        <IoMdMenu className='ml-[-13px]' />
                                    </button>
                                    {ReactDOM.createPortal(
                                        <DropdownMenu />,
                                        document.getElementById('dropdown-portal')
                                    )}
                                </div> */}
                                <div className="flex mb-1">
                                    {categories.map(category => (
                                        <div
                                            key={category}
                                            className={`p-2 rounded mr-5 transition-all duration-300 ease-in-out ${selectedCategory === category ? 'bg-gray-400 text-white transform scale-105' : 'text-black hover:bg-gray-300'}`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                        </div>
                                    ))}
                                </div>
                                <div className="relative flex items-center">
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            placeholder="Search articles..."
                                            value={searchTerm}
                                            onChange={handleSearchInputChange}
                                            className="px-3 py-2 border-[2px] border-gray-800 rounded focus:outline-none focus:border-blue-500 pl-10"
                                        />
                                        <button
                                            onClick={handleVoiceSearch}
                                            className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-3 border-l border-gray-300 bg-white"
                                        >
                                            {voiceSearching ? (
                                                <FaMicrophone className="animate-pulse text-green-500" size={24} />
                                            ) : (
                                                <FaMicrophone className="text-gray-500" size={24} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-12 pl-20 pr-20">
                            {filteredArticles.length > 0 ? (
                                filteredArticles.map((article, index) => (
                                    <div key={article._id} className={`bg-white text-black rounded-lg shadow-lg overflow-hidden ${generateMarginTopClass(index)} transition-all duration-500 ease-in-out delay-${index}`}>
                                        <div className="md:flex">
                                            <div className="md:w-1/2 p-2">
                                                <Link to={`/user-articles/${article._id}`} id='hov' className="text-[18px] font-bold mb-2">{article.title}</Link>
                                                <p className="text-gray-400 pb-2 pt-2">Published at {new Intl.DateTimeFormat('en-GB').format(new Date(article.createdAt))}</p>
                                                <p className="text-[#272f40] text-[14px] mb-4">
                                                    {truncateContent(article.content)}
                                                    {article.content.split(' ').length > 20 && (
                                                        <Link className="text-blue-500 cursor-pointer ml-1" to={`/user-articles/${article._id}`}>
                                                            Read more
                                                        </Link>
                                                    )}
                                                </p>
                                                <div className="flex mt-4">
                                                    <Link
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 mr-2 rounded"
                                                        to={`/update/${article._id}`}
                                                    >
                                                        Update
                                                    </Link>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                                        onClick={() => {
                                                            setArticleToDelete(article._id);
                                                            setShowDeleteModal(true);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="md:w-1/2">
                                                {article.image && (
                                                    <Link to={`/user-articles/${article._id}`}>
                                                        <img
                                                            id='round'
                                                            src={`data:${article.image.contentType};base64,${arrayBufferToBase64(article.image.data.data)}`}
                                                            alt={article.title}
                                                            className="w-full h-auto object-cover"
                                                        />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-3xl mt-8 text-white">Dont Have Any Articles to Show...!</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this article?</h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                onClick={handleDeleteArticle}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserArticleList;
