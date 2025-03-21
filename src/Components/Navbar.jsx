import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { FaUser, FaSignOutAlt, FaBook } from "react-icons/fa";
import { useSelector } from "react-redux";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);

    const isDark = useSelector((state) => state.darkMode.isDark);

    // Check for user in localStorage on component mount
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }, []);

    // Handle logout (we'll replace this with Redux actions later)
    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        setDropdownOpen(false);
    };

    return (
        <nav className={`w-full sticky top-0 z-50 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <div className={`${isDark ? 'bg-gray-900' : 'bg-white bg-opacity-65'} font-Poppins flex justify-between items-center p-5`}>
                <Link to="/">
                    <h2 className={`font-Oswald font-base text-2xl ${isDark ? 'text-white' : 'text-black'}`}>eBook</h2>
                </Link>

                <ul className="hidden md:flex items-center gap-5 text-medium font-base cursor-pointer">
                    <Link to='/'><li className="hover:text-blue-500 transition">Home</li></Link>
                    <Link to='/browsebook'><li className="hover:text-blue-500 transition">Browse Book</li></Link>
                    <Link to="/addbooks"><li className="hover:text-blue-500 transition">Add books</li></Link>

                    {user ? (
                        <li className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-1 hover:text-blue-500 transition"
                            >
                                <FaUser className="text-sm" />
                                <span>{user.name || 'Account'}</span>
                            </button>

                            {dropdownOpen && (
                                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                                    isDark ? 'bg-gray-800' : 'bg-white'
                                } ring-1 ring-black ring-opacity-5`}>
                                    <Link
                                        to="/profile"
                                        className={`block px-4 py-2 text-sm ${
                                            isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/reading-list"
                                        className={`block px-4 py-2 text-sm ${
                                            isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaBook className="text-xs" />
                                            <span>Reading List</span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                            isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaSignOutAlt className="text-xs" />
                                            <span>Sign Out</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </li>
                    ) : (
                        <Link to="/login">
                            <li className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
                                Login
                            </li>
                        </Link>
                    )}

                    <li><DarkModeToggle /></li>
                </ul>

                <div className="md:hidden flex items-center gap-3">
                    {user ? (
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className={`p-2 rounded-full ${
                                isDark ? 'bg-gray-800' : 'bg-gray-100'
                            }`}
                        >
                            <FaUser />
                        </button>
                    ) : (
                        <Link to="/login">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                                Login
                            </button>
                        </Link>
                    )}

                    <DarkModeToggle />
                    <HiOutlineMenu
                        className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'}`}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>
            </div>

            {dropdownOpen && user && (
                <div className={`md:hidden p-2 ${
                    isDark ? 'bg-gray-800' : 'bg-white border-t'
                }`}>
                    <Link
                        to="/profile"
                        className={`block px-4 py-2 rounded-md ${
                            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => {
                            setDropdownOpen(false);
                            setIsOpen(false);
                        }}
                    >
                        Profile
                    </Link>
                    <Link
                        to="/reading-list"
                        className={`block px-4 py-2 rounded-md ${
                            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => {
                            setDropdownOpen(false);
                            setIsOpen(false);
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <FaBook className="text-xs" />
                            <span>Reading List</span>
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 rounded-md ${
                            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <FaSignOutAlt className="text-xs" />
                            <span>Sign Out</span>
                        </div>
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="p-2">
                    <ul className={`md:hidden flex flex-col justify-start gap-2 rounded-md w-full text-medium font-base cursor-pointer p-3 ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
                    }`}>
                        <Link to='/' onClick={() => setIsOpen(false)}>
                            <li className="px-4 py-2 hover:bg-gray-700 hover:text-white rounded-md">Home</li>
                        </Link>
                        <Link to='/browsebook' onClick={() => setIsOpen(false)}>
                            <li className="px-4 py-2 hover:bg-gray-700 hover:text-white rounded-md">Browse Book</li>
                        </Link>
                        <Link to="/addbooks" onClick={() => setIsOpen(false)}>
                            <li className="px-4 py-2 hover:bg-gray-700 hover:text-white rounded-md">Add books</li>
                        </Link>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;