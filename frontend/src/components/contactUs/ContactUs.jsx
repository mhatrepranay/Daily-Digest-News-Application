import React, { useState } from 'react';
import Footer from '../footer/Footer';
import DateNavbar from '../home/Datenavbar';
import toast from 'react-hot-toast';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function


    const handleSubjectChange = (e) => setSubject(e.target.value);
    const handleMessageChange = (e) => setMessage(e.target.value);

    const handleSendEmail = () => {
        if (subject.trim().length > 0 && message.trim().length > 0) {
            const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent("mhatrepranay1234@gmail.com")}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            window.open(emailUrl); // Open Gmail compose window
            setMessage('');
            setSubject('');
        } else {
            toast.error('Please fill in both the subject and message fields first.');
        }
    };

    return (
        <>
            <DateNavbar />
            <section className=" ">
                <IoMdArrowRoundBack
                    size={30}
                    className='text-white cursor-pointer'
                    onClick={() => navigate("/")} // Navigate back on click
                />

                <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Us</h2>
                    <p className="mb-8  font-bold text-center text-white">
                        If you're interested in contributing to our DailyDigest with new articles every day, please feel free to reach out to us!
                    </p>
                    <form className="space-y-8">
                        <div>
                            <label htmlFor="subject" className="block mb-2 text-xl font-medium text-white">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                                placeholder="Write a subject..."
                                value={subject}
                                onChange={handleSubjectChange}

                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block mb-2   font-medium text-white text-xl">Your message</label>
                            <textarea
                                id="message"
                                rows="6"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Write a message...."
                                value={message}
                                onChange={handleMessageChange}
                            ></textarea>
                        </div>
                        <button
                            type="button" // explicitly set type to "button"
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
                            onClick={handleSendEmail}
                        >
                            Send
                        </button>

                    </form>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ContactUs;
