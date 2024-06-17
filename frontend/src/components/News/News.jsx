import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultImage from "../../assets/news.jpeg";
import "./news.css";
import { useInView } from "react-intersection-observer";
import DateNavbar from "../home/Datenavbar";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import Loader from "../loader/loader";

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("Google");
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const navigate = useNavigate();

    const { ref, inView } = useInView({
        triggerOnce: true, // Trigger the fade-in effect only once
        threshold: 0.1, // Trigger when 10% of the element is visible
    });

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(
                    `https://newsapi.org/v2/everything?q=${selectedCategory}&from=2024-06-15&to=2024-06-16&language=en&sortBy=popularity&pageSize=${pageSize}&page=${page}&apiKey=4b43ffab6b144171aadcead4f8f10f2e`
                );
                setArticles(response.data.articles);
                setLoading(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchNews();
    }, [selectedCategory, page]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setPage(1); // Reset page number when category changes
    };

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePrevPage = () => {
        setPage(page - 1);
    };

    return (
        <>
            <DateNavbar />
            <IoMdArrowRoundBack
                size={30}
                className='text-white cursor-pointer'
                onClick={() => navigate("/")} // Navigate back on click
            />
            {
                loading ? (
                    <Loader />
                ) : (
                    <div className="mt-10 fade-in" ref={ref}>
                        <h1 className="text-white font-bold" style={{ textAlign: "center", marginBottom: "20px", fontSize: "35px" }}>
                            {`${selectedCategory} News`}
                        </h1>
                        <div className="bg-white p-2 w-[85%] ml-[17vh]" style={{ textAlign: "center", marginBottom: "20px", backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 9px, gray 10px)" }}>
                            <div style={{ display: "inline-block" }}>
                                <button
                                    onClick={() => handleCategoryClick("Google")}
                                    className={`category-button ${selectedCategory === "Google" ? "active" : ""}`}
                                >
                                    Google
                                </button>
                                <button
                                    onClick={() => handleCategoryClick("Artificial Intelligence")}
                                    className={`category-button ${selectedCategory === "Artificial Intelligence" ? "active" : ""}`}
                                >
                                    Artificial Intelligence
                                </button>
                                <button
                                    onClick={() => handleCategoryClick("Apple")}
                                    className={`category-button ${selectedCategory === "Apple" ? "active" : ""}`}
                                >
                                    Apple
                                </button>
                                <button
                                    onClick={() => handleCategoryClick("TCS")}
                                    className={`category-button ${selectedCategory === "TCS" ? "active" : ""}`}
                                >
                                    TCS
                                </button>
                                <button
                                    onClick={() => handleCategoryClick("Tesla")}
                                    className={`category-button ${selectedCategory === "Tesla" ? "active" : ""}`}
                                >
                                    Tesla
                                </button>
                                <button
                                    onClick={() => handleCategoryClick("Microsoft")}
                                    className={`category-button ${selectedCategory === "Microsoft" ? "active" : ""}`}
                                >
                                    Microsoft
                                </button>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                borderRadius: "20px",
                                width: "75%",
                                margin: "0 auto",
                            }}
                        >
                            {inView &&
                                articles
                                    .filter((article) => article.title !== "[Removed]") // Filter out empty titles
                                    .map((article, index) => (
                                        <div
                                            key={index}
                                            className="news-article fade-in"
                                            style={{
                                                display: "flex",
                                                flexDirection: "row-reverse", // Image on the right side
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                margin: "20px 0",
                                                padding: "10px",
                                                backgroundColor: "#f0f0f0",
                                                borderRadius: "10px",
                                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                {article.urlToImage ? (
                                                    <img
                                                        src={article.urlToImage}
                                                        alt={article.title}
                                                        style={{ width: "80%", height: "80%" }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={defaultImage}
                                                        alt="Default"
                                                        style={{ width: "100%", height: "auto" }}
                                                    />
                                                )}
                                            </div>

                                            <div style={{ flex: 1, padding: "10px", textAlign: "left" }}>
                                                <h2 style={{ color: "#333", fontSize: "30px", fontWeight: 600 }}>
                                                    {article.title}
                                                </h2>
                                                <p style={{ color: "#000", fontWeight: "500" }}>{article.description}</p>
                                                <p style={{ color: "#555", fontWeight: "500" }}>
                                                    Published at: {new Date(article.publishedAt).toLocaleString()}
                                                </p>
                                                <a
                                                    style={{ color: "#ff5454", fontWeight: 600 }}
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Read More...
                                                </a>
                                            </div>
                                        </div>
                                    ))}

                            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                                <button
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className={`${page === 1 ? "cursor-not-allowed " : ""} min-h-[45px] bg-[#39a2e8] w-[100px] mr-2 rounded-full`}
                                >
                                    Previous
                                </button>
                                <button className="min-h-[45px] bg-[#48a2dd] w-[100px] rounded-full" onClick={handleNextPage}>
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                )
            }

        </>
    );
};

export default News;
