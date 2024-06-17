import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import useLoggedInUser from '../customhook/loginUserData';

const DateNavbar = () => {
    const navigate = useNavigate();
    const [dateTime, setDateTime] = useState({
        day: '',
        date: '',
        time: ''
    });
    const [temperature, setTemperature] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user authentication status
    const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown
    const [showModal, setShowModal] = useState(false); // State to control the logout confirmation modal

    useEffect(() => {
        // Function to check if user is logged in (e.g., by checking local storage)
        const checkLoggedInStatus = () => {
            const userToken = localStorage.getItem('token'); // Example: Store token in local storage
            if (userToken) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        };

        // Call function to check initially
        checkLoggedInStatus();

        const updateDateTime = () => {
            const now = new Date();
            const day = now.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
            const date = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
            const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            setDateTime({ day, date, time });
        };

        const fetchWeatherData = async (latitude, longitude) => {
            const apiKey = '0cd1b3f77906668d0751f422f3310e56';
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    setTemperature(data.main.temp);
                } else {
                    console.error('Failed to fetch weather data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };


        const fetchLocationAndWeather = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherData(latitude, longitude);

                    },
                    (error) => {
                        console.error('Error getting location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        updateDateTime(); // Update date and time immediately
        fetchLocationAndWeather(); // Fetch weather and location data

        const intervalId = setInterval(updateDateTime, 1000); // Update date and time every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    const handleLogout = () => {
        // Clear user token from local storage or session storage
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setShowModal(false);
        navigate('/');
    };

    const handleToggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const user = useLoggedInUser();

    return (
        <div id='hi' className="h-10 w-full flex items-center mt-2 text-sm text-white">
            <div className="ml-5">
                <span className="ml-10">{dateTime.day} ,</span>
                <span className="mx-2">{dateTime.date} |</span>
                <span className="mx-2">UPDATED {dateTime.time} IST</span>
                {temperature && <span className="mx-2">| {temperature.toFixed(1)}°C</span>}
            </div>
            <div className="ml-auto mr-5 relative">
                {isLoggedIn ? (
                    <div className="flex items-center">
                        <button className="profile-button" onClick={handleToggleDropdown}>
                            <FontAwesomeIcon icon={faUserCircle} size="2x" />
                        </button>
                        {showDropdown && (
                            <div className="absolute right-[-3px] mt-[100px] w-48 bg-gray-400 text-black rounded-md shadow-lg">
                                <button
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                    onClick={() => navigate(user.role === "Admin" ? '/admin' : '/profile')}

                                >
                                    Profile
                                </button>
                                <button
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                    onClick={handleShowModal}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="flex flex-row justify-center items-center py-1 rounded-[10px] cursor-pointer text-black bg-[#e0e5e6] w-[80px]">
                        SIGN IN
                    </Link>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-gray-500 p-5 rounded-md shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-4">Are you sure you want to logout?</p>
                        <div className="flex justify-center">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
                                onClick={handleCloseModal}
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                                onClick={handleLogout}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateNavbar;
