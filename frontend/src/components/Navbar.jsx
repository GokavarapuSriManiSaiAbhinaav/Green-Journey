import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaLeaf, FaSignOutAlt, FaUserLock, FaUpload, FaHome, FaInfoCircle, FaUserCircle } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        closeMenu();
        navigate('/admin');
    };

    const handleNavigation = (path) => {
        closeMenu();
        navigate(path);
        if (path === '/' && location.pathname === '/') {
            // If already on home, smooth scroll to top or timeline
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                {/* Logo Section */}
                <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 group z-50">
                    <div className="bg-green-50 p-2 rounded-xl group-hover:bg-green-100 transition-colors">
                        <FaLeaf className="text-xl text-green-600" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-green-700 transition-colors">
                        Green<span className="text-green-600">Journey</span>
                    </span>
                </Link>

                {/* Hamburger Icon */}
                <button
                    onClick={toggleMenu}
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors z-50 text-gray-700"
                    aria-label="Menu"
                >
                    {isOpen ? <HiX size={28} /> : <HiOutlineMenuAlt3 size={28} />}
                </button>

                {/* Dropdown Menu Overlay */}
                {isOpen && (
                    <div className="absolute top-20 left-0 right-0 sm:left-auto sm:right-4 sm:w-72 bg-white sm:rounded-2xl shadow-xl border-t sm:border border-gray-100 p-4 animate-fade-in origin-top transform transition-all z-50">
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => handleNavigation('/')}
                                    className="w-full text-left px-4 py-4 sm:py-3 rounded-xl hover:bg-green-50 active:bg-green-100 flex items-center space-x-3 text-gray-700 hover:text-green-700 transition-all font-medium"
                                >
                                    <FaHome className="text-green-500 text-xl sm:text-base" />
                                    <span className="text-base sm:text-sm">Explore Timeline</span>
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => handleNavigation('/about')}
                                    className="w-full text-left px-4 py-4 sm:py-3 rounded-xl hover:bg-green-50 active:bg-green-100 flex items-center space-x-3 text-gray-700 hover:text-green-700 transition-all font-medium"
                                >
                                    <FaInfoCircle className="text-blue-500 text-xl sm:text-base" />
                                    <span className="text-base sm:text-sm">About Green Journey</span>
                                </button>
                            </li>

                            <div className="my-2 border-t border-gray-100"></div>

                            {token ? (
                                <>
                                    <li>
                                        <button
                                            onClick={() => handleNavigation('/admin/upload')}
                                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-green-50 flex items-center space-x-3 text-gray-700 hover:text-green-700 transition-all font-medium"
                                        >
                                            <FaUserCircle className="text-purple-500" />
                                            <span>Start Uploading</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-all font-medium"
                                        >
                                            <FaSignOutAlt className="text-red-400" />
                                            <span>Logout</span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <button
                                        onClick={() => handleNavigation('/admin')}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-green-50 flex items-center space-x-3 text-gray-700 hover:text-green-700 transition-all font-medium"
                                    >
                                        <FaUserCircle className="text-gray-500" />
                                        <span>Admin Login</span>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Full screen transparent backdrop to handle clicking outside */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/5"
                        onClick={closeMenu}
                    ></div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
