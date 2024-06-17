import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import ArticleList from '../admin/ArtcleList';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import Loader from '../loader/loader';

const images = [
    './src/assets/Screenshot (210).png',
    './src/assets/Screenshot (206).png',
    './src/assets/Screenshot (207).png',
    './src/assets/Screenshot (208).png',
    './src/assets/Screenshot (209).png',
];

const headlines = [
    "Breaking News: Major Event Unfolds...",
    "Latest Update: New Policy Announced...",
    "Sports: Local Team Wins Championship...",
    "Weather: Storm Warning Issued for Area...",
    "Tech: New Smartphone Model Released..."
];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const articlesResponse = await axios.get('https://dailydigest-backend-1.onrender.com/api/articles');
                setArticles(articlesResponse.data); // Assuming articlesResponse.data is an array of articles
                setLoading(false);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    useEffect(() => {
        const startSlider = () => {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === images.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);
        };

        startSlider();

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        const handleArrowClick = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === images.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000);
        };

        handleArrowClick();

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [currentIndex]);

    const prevSlide = () => {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const nextSlide = () => {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    const lastFiveArticles = articles.slice(-5).reverse();

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="relative pr-10 pl-10 pt-3 hide1">
                    <div className="flex" style={{ width: '1450px', height: '350px', background: "linear-gradient(to right, rgb(185 185 185), #706dc9)" }}>
                        <Link to={`/articles/${lastFiveArticles[currentIndex]?._id}`} className="relative flex items-center justify-center" style={{ flex: '1 1 50%', height: '100%' }}>
                            {lastFiveArticles.map((article, index) => (
                                <div key={index} className={`slider-text text-3xl font-bold p-3 ${index === currentIndex ? 'active' : ''}`}>
                                    {article.title}
                                </div>
                            ))}
                        </Link>

                        <Link to={`/articles/${lastFiveArticles[currentIndex]?._id}`} className="overflow-hidden flex items-center justify-center relative" style={{ flex: '1 1 50%', height: '100%' }}>
                            {lastFiveArticles.map((article, index) => (
                                <img
                                    key={index}
                                    src={`data:${article.image.contentType};base64,${arrayBufferToBase64(article.image.data.data)}`}
                                    alt={`Slide ${index}`}
                                    className="absolute flex items-center justify-center h-[90%] object-cover transition-opacity duration-1000"
                                    style={{ opacity: index === currentIndex ? 1 : 0 }}
                                />
                            ))}
                        </Link>
                    </div>

                    <button
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white rounded-full p-2"
                        onClick={prevSlide}
                    >
                        &#10094;
                    </button>
                    <button
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white rounded-full p-2"
                        onClick={nextSlide}
                    >
                        &#10095;
                    </button>

                    <div className="absolute  bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {lastFiveArticles.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === idx ? 'bg-black' : 'bg-gray-700'}`}
                                onClick={() => setCurrentIndex(idx)}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="p-3">
                <Headline headlines={headlines} />
            </div>

            <div>
                <ArticleList />
            </div>
        </>
    );
};

const Headline = ({ headlines }) => {
    return (
        <div className="flex items-center">
            <span style={{ color: "red" }} className="text-3xl flex items-end bg-white h-7 "><span className='animate-blink'> •</span></span>

            <div className="bg-red-600 text-white h-7 w-full flex items-center overflow-hidden">
                <div className="whitespace-nowrap animate-marquee">
                    {headlines.map((headline, index) => (
                        <span key={index} className="mx-4 text-lg font-semibold">{headline}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
