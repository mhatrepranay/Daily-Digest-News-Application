import React, { useState } from 'react';
import { FiHome, FiUsers, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { TiNews } from "react-icons/ti";
import { MdManageHistory } from "react-icons/md";
import { IoBarChartSharp } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false); // State to control the logout confirmation modal

    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user token from local storage or session storage
        localStorage.removeItem('token');
        navigate('/login'); // Redirect to home or login page
    };

    return (
        <div className={`bg-gray-900 text-white pt-10 min-h-screen transition-all duration-300 relative ${collapsed ? 'w-16' : 'w-64'} sticky top-0`}>
            {/* Logo and Title */}
            <div className="flex items-center justify-between p-4 relative">
                <div className={`text-xl font-bold tracking-widest transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>Admin Panel</div>
                <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-4 top-4 focus:outline-none bg-gray-900 p-1 rounded-full">
                    {collapsed ? <FiChevronRight style={{ fontSize: "39px" }} className="text-white text-30px font-semibold " /> : <FiChevronLeft style={{ fontSize: "39px" }} className="text-white" />}
                </button>
            </div>

            {/* Sidebar Links */}
            <div className="flex-1">
                <ul className="space-y-4 mt-6">
                    <li>
                        <Link to="/admin" className="flex items-center space-x-2 pl-8 rounded-lg hover:bg-gray-800">
                            <FiHome className="text-xl" />
                            <span className={`${collapsed ? 'hidden' : 'block'} pl-1`}>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
                            <span className={`${collapsed ? 'hidden' : 'block'} text-xl font-bold`}>Articles</span>
                        </div>
                    </li>
                    <li>
                        <Link to="/articles" className="flex items-center space-x-2 pl-8 rounded-lg hover:bg-gray-800">
                            <FiUsers className="text-xl" />
                            <span className={`${collapsed ? 'hidden' : 'block'} pl-1`}>Articles List</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/create-news" className="flex items-center space-x-2 pl-8 rounded-lg hover:bg-gray-800">
                            <TiNews className="text-xl" />
                            <span className={`${collapsed ? 'hidden' : 'block'} pl-1`}>Add Article</span>
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
                            <span className={`${collapsed ? 'hidden' : 'block'} text-xl font-bold`}>Customization</span>
                        </div>
                    </li>
                    <li>
                        <Link to="/user-list" className="flex items-center space-x-2 pl-8 rounded-lg hover:bg-gray-800">
                            <FiUsers className="text-xl" />
                            <span className={`${collapsed ? 'hidden' : 'block'} pl-1`}>Manage Team</span>
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
                            <span className={`${collapsed ? 'hidden' : 'block'} text-xl font-bold`}>Analytics</span>
                        </div>
                    </li>
                    <li>
                        <Link to="/article-analytics" className="flex items-center space-x-2 pl-8 rounded-lg hover:bg-gray-800">
                            <IoBarChartSharp className="text-xl" />
                            <span className={`${collapsed ? 'hidden' : 'block'} pl-1`}>Article Analytics</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/user-analytics" className="flex items-center space-x-2 pl-8 rounded-lg hover:bg-gray-800">
                            <MdManageHistory className="text-xl" />
                            <span className={`${collapsed ? 'hidden' : 'block'} pl-1`}>User Analytics</span>
                        </Link>
                    </li>

                </ul>
            </div>


            <div className="absolute bottom- left-0 right-0 p-4">
                <Link to="/" className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800"  >
                    <FaHome className="text-xl" />
                    <span className={`${collapsed ? 'hidden' : 'block'}`}>Home</span>
                </Link>
            </div>
            {/* Logout Button */}
            <div className="absolute bottom-5 left-0 right-0 p-4">
                <Link to="#" className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-800" onClick={() => setShowModal(!showModal)}>
                    <FiLogOut className="text-xl" />
                    <span className={`${collapsed ? 'hidden' : 'block'}`}>Logout</span>
                </Link>
            </div>

            {/* Logout Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[-1] bg-black bg-opacity-50">
                    <div className="bg-gray-500 p-5 rounded-md shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-4">Are you sure you want to logout?</p>
                        <div className="flex justify-center">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
                                onClick={() => setShowModal(false)}
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

export default AdminSidebar;
