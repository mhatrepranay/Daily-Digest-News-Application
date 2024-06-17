import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Loader from '../loader/loader';
import './admin.css'; // Import your custom styles here
import { AiTwotoneDislike, AiTwotoneLike, AiOutlineClose } from 'react-icons/ai';

import { FaHome, FaMicrophone } from 'react-icons/fa'; // Import microphone icon
import { IoMdMenu } from 'react-icons/io'; // Import menu icon
import useLoggedInUser from '../customhook/loginUserData';
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import AdminSidebar from './Sidebar/AdminSidebar';


const AdminArticleDetails = () => {
    const { id } = useParams();
    const [articles, setArticles] = useState([]);
    const [article, setArticle] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [voiceSearching, setVoiceSearching] = useState(false);
    const [sortBy, setSortBy] = useState('date'); // Default sorting by date
    const [sortBy1, setSortBy1] = useState('date'); // Default sorting by date
    const [sortOrder1, setSortOrder1] = useState('desc'); // Default descending order
    const [sortOrder, setSortOrder] = useState('desc'); // Default descending order
    const [dropdownVisible, setDropdownVisible] = useState(false); // State for dropdown visibility
    const [newComment, setNewComment] = useState('');
    const [commentsExpanded, setCommentsExpanded] = useState(false);
    const [showAllArticles, setShowAllArticles] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null); // State for article to be deleted
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal


    const user = useLoggedInUser();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`https://dailydigest-backend-1.onrender.com/api/articles/${id}`);
                setArticle(response.data);
                setLoading(false);
                setShowAllArticles(false); // Ensure showAllArticles is false when fetching a specific article
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };

        fetchArticle();
    }, [id]);

    useEffect(() => {
        const fetchArticlesAndCategories = async () => {
            try {
                const articlesResponse = await axios.get('https://dailydigest-backend-1.onrender.com/api/articles');
                setArticles(articlesResponse.data);

                const categoriesResponse = await axios.get('https://dailydigest-backend-1.onrender.com/api/categories');
                setCategories(['All', ...categoriesResponse.data]);

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
            return words.slice(0, 20).join(' ');
        } else {
            return content;
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
        setVoiceSearching(false); // Disable voice search when typing manually
        setShowAllArticles(true);
    };

    const handleVoiceSearch = () => {
        setVoiceSearching(true);

        // Simulating voice search - replace with actual SpeechRecognition API usage
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchTerm(transcript);
            setShowAllArticles(true);
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
        setShowAllArticles(true);

    };

    const handleSortOrderDesc = () => {
        setSortOrder('desc');
        setShowAllArticles(true);

    };

    const handleSortByDate = () => {
        setSortBy('date');
        setSortOrder('desc');
        setShowAllArticles(true);
    };

    const handleSortByPopularity = () => {
        setSortBy1('popularity1');
        setSortOrder1('desc1');
        setShowAllArticles(true);

    };

    const formatTimeAgo = (createdAt) => {
        const currentDate = new Date();
        const commentDate = new Date(createdAt);
        const diffTime = Math.abs(currentDate - commentDate);
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));

        if (diffMinutes < 60) {
            return `${diffMinutes} min ago`;
        } else if (diffMinutes < 24 * 60) {
            return `${Math.floor(diffMinutes / 60)} hours ago`;
        } else if (diffMinutes < 30 * 24 * 60) {
            return `${Math.floor(diffMinutes / (24 * 60))} days ago`;
        } else if (diffMinutes < 365 * 24 * 60) {
            return `${Math.floor(diffMinutes / (30 * 24 * 60))} months ago`;
        } else {
            return `${Math.floor(diffMinutes / (365 * 24 * 60))} years ago`;
        }
    };

    const handleAddComment = async (articleId) => {
        try {
            const response = await axios.post(`https://dailydigest-backend-1.onrender.com/api/articles/${articleId}/comments`, {
                user: user,
                content: newComment
            });
            // Update the article state to reflect the new comment
            setArticle(response.data);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleLikeArticle = async (id) => {
        try {
            const response = await axios.post(`https://dailydigest-backend-1.onrender.com/api/articles/${id}/like`);
            // Update the article state to reflect the updated likes
            setArticle(response.data);
        } catch (error) {
            console.error('Error liking article:', error);
        }
    };

    const handleDislikeArticle = async (id) => {
        try {
            const response = await axios.post(`https://dailydigest-backend-1.onrender.com/api/articles/${id}/dislike`);
            // Update the article state to reflect the updated dislikes
            setArticle(response.data);
        } catch (error) {
            console.error('Error disliking article:', error);
        }
    };

    const handleLikeComment = async (articleId, commentId) => {
        try {
            const response = await axios.post(`https://dailydigest-backend-1.onrender.com/api/articles/${articleId}/comments/${commentId}/like`);
            // Update the article state to reflect the updated comment likes
            setArticle(response.data);
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleDislikeComment = async (articleId, commentId) => {
        try {
            const response = await axios.post(`https://dailydigest-backend-1.onrender.com/api/articles/${articleId}/comments/${commentId}/dislike`);
            // Update the article state to reflect the updated comment dislikes
            setArticle(response.data);
        } catch (error) {
            console.error('Error disliking comment:', error);
        }
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

    const handleCommentClick = () => {
        setCommentsExpanded(true);
    };

    const handleCloseComments = () => {
        setCommentsExpanded(false);
    };

    const formatContent = (content) => {
        return content.split('\n').map((str, index) => (
            <React.Fragment key={index}>
                {str}
                <br />
            </React.Fragment>
        ));
    };
    const handlesetSelectedCategory = (category) => {
        setSelectedCategory(category)
        setShowAllArticles(true);
    }




    const DropdownMenu = () => {
        // Calculate position dynamically based on the button position
        const dropdownStyle = {
            position: 'absolute',
            top: '9vh', // Adjust the distance from the button as needed
            left: '41vh',
            zIndex: 1000, // Ensure it's above other elements
            backgroundColor: '#gray',
            minWidth: '160px',
            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
            borderRadius: '4px',
            display: dropdownVisible ? 'block' : 'none', // Show only when dropdownVisible is true
        };

        return (
            <div className="dropdown-content" style={dropdownStyle}>
                <a onClick={() => {
                    handleSortByDate()
                }}>
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
                <>
                    <div className="flex">
                        <AdminSidebar />

                        <div className="hide1 flex-1 pl-3 overflow-auto h-screen">
                            <div className="sticky top-0 z-10 rounded-lg bg-white shadow-md pl-[1px] pt-2">
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
                                        <Link to={"/admin"} className='flex items-center mr-5'>

                                            <FaHome />
                                        </Link>
                                        {categories.map(category => (


                                            <div
                                                key={category}
                                                className={`p-2 rounded mr-5 transition-all duration-300 ease-in-out ${selectedCategory === category ? 'bg-gray-400 text-white transform scale-105' : 'text-black hover:bg-gray-300'}`}
                                                onClick={() => handlesetSelectedCategory(category)}
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
                            {
                                showAllArticles ? (
                                    <div className="grid grid-cols-2 fade-in gap-4 mb-12 pl-20 pr-20">
                                        {filteredArticles.length > 0 ? (
                                            filteredArticles.map((article, index) => (
                                                <div key={article._id} className={`bg-white text-black rounded-lg shadow-lg overflow-hidden ${generateMarginTopClass(index)} transition-all duration-500 ease-in-out delay-${index}`}>
                                                    <div className="md:flex">
                                                        <div className="md:w-1/2 p-2">
                                                            <Link to={`/admin-articles/${article._id}`} id='hov' className="text-[18px] font-bold mb-2">{article.title}</Link>
                                                            <p className="text-gray-400 pb-2 pt-2">Published at {new Intl.DateTimeFormat('en-GB').format(new Date(article.createdAt))}</p>
                                                            <p className="text-[#272f40] text-[14px] mb-4">
                                                                {truncateContent(article.content)}
                                                                {article.content.split(' ').length > 20 && (
                                                                    <Link className="text-blue-500 cursor-pointer ml-1" to={`/admin-articles/${article._id}`}>
                                                                        ... Read more
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
                                                                <Link to={`/admin-articles/${article._id}`}>
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

                                ) : (
                                    <div id='bggrad' className="max-w-[70rem] fade-in mt-5 mx-auto p-4 bg-white   text-black rounded-lg shadow-2xl overflow-hidden">
                                        <h1 className="text-4xl font-bold mb-1 ">{article.title}</h1>
                                        <h2 className="mb-4  ">{truncateContent(article.content)}</h2>
                                        {article.image && (
                                            <img
                                                src={`data:${article.image.contentType};base64,${arrayBufferToBase64(article.image.data.data)}`}
                                                alt={article.title}
                                                className="w-full h-auto object-cover mb-4"
                                            />
                                        )}
                                        <p className="text-white-800 mb-4">{formatContent(article.content)}</p>
                                        <p className="text-gray-600 mb-4 pl-4 max-w-[350px] rounded-full bg-gray-300">Author: {article.author}</p>
                                        <p className="text-gray-400 pb-2 pt-2">Published at {new Intl.DateTimeFormat('en-GB').format(new Date(article.createdAt))}</p>
                                        <div className="flex justify-center mt-4 space-x-2 bg-gray-200 rounded-full max-w-[9rem] p-1">
                                            <button
                                                className="flex items-center space-x-1 text-black py-1 rounded transition-colors duration-300"
                                                onClick={() => handleLikeArticle(article._id)}
                                            >
                                                <AiTwotoneLike size={30} /> <span>{article.likes}</span>
                                            </button>
                                            <span className='text-3xl'>|</span>
                                            <button
                                                className="flex items-center space-x-1 text-black py-1 rounded transition-colors duration-300"
                                                onClick={() => handleDislikeArticle(article._id)}
                                            >
                                                <AiTwotoneDislike size={30} /> <span>{article.dislikes}</span>
                                            </button>
                                        </div>
                                        <div className="mt-4 ">
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment"
                                                className="border  focus:border-white p-2 rounded w-full"
                                            />
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 mt-2 rounded transition-colors duration-300"
                                                onClick={() => handleAddComment(article._id)}
                                            >
                                                Add Comment
                                            </button>
                                        </div>
                                        <div className="pt-5">
                                            {commentsExpanded ? (
                                                <>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <button onClick={handleCloseComments} className="text-black font-bold text-xl">
                                                            Comments
                                                        </button>
                                                        <button className="text-black" onClick={handleCloseComments}>
                                                            <AiOutlineClose size={20} />
                                                        </button>
                                                    </div>

                                                    {article.comments.map(comment => (
                                                        <div key={comment._id} className="border-t pt-2 mt-2">
                                                            <p>{comment.user.username} <span className='ml-4'></span> <span className='text-gray-500'>•{formatTimeAgo(comment.createdAt)}</span></p>
                                                            <p className='font-bold text-gray-700'>{comment.content}</p>
                                                            <div className="flex ml-[-5px] space-x-2 rounded-full max-w-[9rem] p-1">
                                                                <button
                                                                    className="flex items-center space-x-1 text-black py-1 rounded transition-colors duration-300"
                                                                    onClick={() => handleLikeComment(article._id, comment._id)}
                                                                >
                                                                    <AiTwotoneLike size={20} className='text-green-600' /> <span>{comment.likes}</span>
                                                                </button>
                                                                <button className="flex items-center space-x-1 text-black py-1 rounded transition-colors duration-300"
                                                                    onClick={() => handleDislikeComment(article._id, comment._id)}
                                                                >
                                                                    <AiTwotoneDislike size={20} className='text-red-500' /> <span>{comment.dislikes}</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    <div className='bg-gray-200 p-2 rounded-lg cursor-pointer'
                                                        onClick={handleCommentClick}>


                                                        <div className="flex justify-between items-center mb-2">
                                                            <button className="text-black font-semibold text-2ml">
                                                                Comments <span className='ml-2 text-gray-500'> {article?.comments?.length}</span>
                                                            </button>

                                                        </div>
                                                        {article.comments.slice(0, 1).map(comment => (


                                                            <div key={comment._id} className="border-t pt-2 mt-2 cursor-pointer" onClick={handleCommentClick}>

                                                                <p className='font-bold text-gray-700'>• {comment.content}</p>
                                                            </div>

                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                )
                            }


                        </div>
                    </div>
                </>
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

export default AdminArticleDetails;

