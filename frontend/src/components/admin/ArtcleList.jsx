import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../loader/loader';
import './admin.css';
import { FaMicrophone } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import useLoggedInUser from '../customhook/loginUserData';
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import Article from './Article';

const ArticleList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [voiceSearching, setVoiceSearching] = useState(false);
    const [sortBy, setSortBy] = useState('date');
    const [sortBy1, setSortBy1] = useState('date');
    const [sortOrder1, setSortOrder1] = useState('desc');
    const [sortOrder, setSortOrder] = useState('desc');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const user = useLoggedInUser();

    useEffect(() => {
        const fetchArticlesAndCategories = async () => {
            try {
                const articlesResponse = await axios.get('https://dailydigest-backend-1.onrender.com/api/articles');
                setArticles(articlesResponse.data);

                const categoriesResponse = await axios.get('https://dailydigest-backend-1.onrender.com/api/categories');
                setCategories(['All', ...categoriesResponse.data, 'Extra']);

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
        setVoiceSearching(false);
    };

    const handleVoiceSearch = () => {
        setVoiceSearching(true);

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

    const searchArticles = (searchQuery) => {
        let filteredArticles = selectedCategory === 'All'
            ? [...articles]
            : articles.filter(article => article.category === selectedCategory);

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
        }
        if (sortBy1 === 'popularity1') {
            filteredArticles.sort((a, b) => {
                const popularityA = calculatePopularity(a);
                const popularityB = calculatePopularity(b);
                return sortOrder1 === 'asc1' ? popularityA - popularityB : popularityB - popularityA;
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
        setSortBy1('popularity1');
        setSortOrder1('desc1');
    };
    const handleCategoryClick = (category) => {
        if (category === 'Extra') {
            navigate('/api-news');
        } else {
            setSelectedCategory(category);
        }
    };

    const DropdownMenu = () => {
        const dropdownStyle = {
            position: 'absolute',
            top: 'calc(100% - 70px)',
            zIndex: 1000,
            backgroundColor: '#gray',
            minWidth: '160px',
            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
            borderRadius: '4px',
            display: dropdownVisible ? 'block' : 'none',
        };

        return (
            <div className="dropdown-content" style={dropdownStyle}>
                <a onClick={() => { handleSortByDate() }}>
                    All
                </a>
                <div className="cursor-pointer flex items-center">
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
                </div>
            </div>
        );
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="hide1 flex-1 overflow-auto h-full">
                    <div style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 9px, gray 10px)" }} className="sticky top-0 z-10 bg-white shadow-md pl-[1px] pt-2">
                        <div className="flex items-center justify-between mb-4 overflow-x-auto">
                            <div className="dropdown relative flex mb-1">
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
                            </div>
                            <div className="flex mb-1">
                                {categories.map(category => (
                                    <div
                                        key={category}
                                        className={`p-2 cursor-pointer rounded mr-5 transition-all duration-300 ease-in-out ${selectedCategory === category ? 'bg-gray-400 text-white transform scale-105' : 'text-black hover:bg-gray-300'}`}
                                        onClick={() => handleCategoryClick(category)}
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
                                <Article key={article._id} article={article} index={index} />
                            ))
                        ) : (
                            <p className="text-center text-3xl mt-8 text-white">Dont Have Any Articles to Show...!</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ArticleList;
