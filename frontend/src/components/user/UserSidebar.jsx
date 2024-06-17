import React, { useState } from 'react';
import { FiUsers, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi';
import { TiNews } from "react-icons/ti";
import useLoggedInUser from '../customhook/loginUserData';
import { FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom';
const UserSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const user = useLoggedInUser();

    // Add a loading state while user data is being fetched
    if (!user) {
        return (
            <div className={`bg-gray-900 text-white pt-10 min-h-screen transition-all duration-300 relative ${collapsed ? 'w-16' : 'w-64'}`}>
                <div className="flex items-center justify-center p-4">
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-[#060b1e] text-white pt-10 min-h-screen transition-all duration-300 relative ${collapsed ? 'w-16' : 'w-64'}`}>
            {/* Logo and Title */}
            <div className="flex items-center justify-between p-4 relative">
                <div className={`text-xl font-bold tracking-widest transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                    {user.username}
                </div>
                <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-4 top-4 focus:outline-none bg-gray-900 p-1 rounded-full">
                    {collapsed ? <FiChevronRight style={{ fontSize: "39px" }} className="text-white text-30px font-semibold " /> : <FiChevronLeft style={{ fontSize: "39px" }} className="text-white" />}
                </button>
            </div>

            {/* Sidebar Links */}
            <div className="flex-1">
                <ul className="space-y-4 mt-6">
                    <li>
                        <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
                            <FiUser className="text-xl" />
                            <span className={`${collapsed ? 'hidden' : 'block'}`}>Profile</span>
                        </Link>
                    </li>


                    {
                        (user.role === "Creator" || user.role === "Admin") && (
                            <li>
                                <Link to="/user-articles" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
                                    <FiUsers className="text-xl" />
                                    <span className={`${collapsed ? 'hidden' : 'block'}`}>Articles</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        (user.role === "Creator" || user.role === "Admin") && (
                            <li>
                                <Link to="/create-news" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
                                    <TiNews className="text-xl" />
                                    <span className={`${collapsed ? 'hidden' : 'block'}`}>Add Article</span>
                                </Link>
                            </li>
                        )
                    }

                    <li>
                        <Link to="/" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
                            <FaHome className="text-xl" />
                            <span className={`${collapsed ? 'hidden' : 'block'}`}>Home</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Logout Button */}
            {/* <div className="p-4 mt-auto">
                <Link to="/" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
                    <FiLogOut className="text-xl" />
                    <span className={`${collapsed ? 'hidden' : 'block'}`}>Logout</span>
                </Link>
            </div> */}
        </div>
    );
};

export default UserSidebar;
