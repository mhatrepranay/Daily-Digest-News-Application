import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import "./footer.css";

const Footer = () => {
    const navigate = useNavigate();

    const handleScrollToTop = (url) => {
        navigate(url);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className='bg'>
            <div className="border border-[#e714141c]" />
            <br />
            <div className="w-95% pl-10 mt-0 800px:w-full 800px:max-w-[85%] mx-auto">
                <div className="grid grid-cols-3 gap-8">


                    <div className="col-span-1">
                        <h1
                            className="font-bold mb-4"
                            style={{ color: "#64DFDF", fontSize: "25px", fontWeight: 500 }}
                        >
                            Quick Links
                        </h1>
                        <ul>
                            <li className="pb-2">
                                <Link to="/" style={{ color: "#6ED5EB" }} onClick={() => handleScrollToTop('/')}>
                                    Home
                                </Link>
                            </li>
                            <li className="pb-2">
                                <Link to="/profile" style={{ color: "#73C6B6" }} onClick={() => handleScrollToTop('/profile')}>
                                    My Account
                                </Link>
                            </li>
                            <li className="pb-2">
                                <Link to="/contactUs" style={{ color: "#83A4D4" }} onClick={() => handleScrollToTop('/courses-dashboard')}>
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h1
                            className="font-bold mb-4"
                            style={{ color: "#FF5E78", fontSize: "25px", fontWeight: 500 }}
                        >
                            Social Links
                        </h1>
                        <ul>
                            <li className="pb-2">
                                <Link to="/youtube" style={{ color: "#FF8C94" }} onClick={() => handleScrollToTop('/youtube')}>
                                    <FaYoutube className="inline-block mr-2" size={20} />
                                    YouTube
                                </Link>
                            </li>
                            <li className="pb-2">
                                <Link to="/instagram" style={{ color: "#FFB4B9" }} onClick={() => handleScrollToTop('/instagram')}>
                                    <FaInstagram className="inline-block mr-2" size={20} />
                                    Instagram
                                </Link>
                            </li>
                            <li className="pb-2">
                                <Link to="/facebook" style={{ color: "#FFDEE4" }} onClick={() => handleScrollToTop('/facebook')}>
                                    <FaFacebook className="inline-block mr-2" size={20} />
                                    Facebook
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h1
                            className="font-bold mb-4"
                            style={{ color: "#FFA738", fontSize: "25px", fontWeight: 500 }}
                        >
                            Contact Info
                        </h1>
                        <p className="pb-2 cursor-pointer">
                            <p style={{ color: "#FFB454" }}>Call Us : 8087155191</p>
                        </p>
                        <p className="pb-2 cursor-pointer">
                            <p style={{ color: "#FFCC6B" }}>
                                Address: 456 Elm Street, Springfield, USA
                            </p>
                        </p>
                        <p className="pb-2 cursor-pointer">
                            <p style={{ color: "#FFE088" }}>
                                Email: @dailyDigest@gmail.com
                            </p>
                        </p>
                    </div>
                </div>
                <br />
                <p className="text-center mt-8" style={{ color: "#A6E22E" }}>
                    Copyright &copy; {new Date().getFullYear()} DailyDigest | All rights reserved.
                </p>
            </div>
            <br />
            <br />
        </footer>
    );
};

export default Footer;
