import React, { useState } from 'react';
import Footer from '../footer/Footer';
import DateNavbar from './Datenavbar';
import Home from './Home';
import { useInView } from 'react-intersection-observer'; // Import the hook
import './Header.css';

const Header = () => {



    // Track visibility using IntersectionObserver
    const [ref, inView] = useInView({
        triggerOnce: true, // Only trigger once
        threshold: 0.3, // Trigger when 50% of the element is visible
    });


    return (
        <>
            <div className="hide1 overflow-auto">
                <DateNavbar />
                <div className=''>


                    <div
                        id="header"

                        className={`flex p-1 items-center hide1 justify-center mt-3  `}
                    >
                        <span className="text-5xl font-semibold text-white mr-3">The </span>
                        <span className="text-5xl font-semibold text-white">Daily</span>
                        <span className="text-5xl font-semibold text-gray-400">Digest</span>
                    </div>
                    <div style={{ color: 'white' }} className={`text-center text-lg mt-3  `}>
                        Where Knowledge Meets Curiosity.
                    </div>
                </div>
                <Home className="hide1" />
            </div>
            <div ref={ref} className={`${inView ? 'fade-in' : 'invisible'}`}>
                <Footer />
            </div>

        </>
    );
};

export default Header;
