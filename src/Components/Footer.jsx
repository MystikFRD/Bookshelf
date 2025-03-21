import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const isDark = useSelector((state) => state.darkMode.isDark);

    return (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-blue-50'} flex flex-col p-10 mt-10`}>
            <div className="max-w-6xl mx-auto w-full">
                <h2 className={`font-Oswald ${isDark ? 'text-white' : 'text-black'} text-4xl mb-6`}>eBook</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className={`font-semibold text-lg mb-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Navigation</h3>
                        <ul className={`flex flex-col gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Link to="/"><li className="hover:underline">Home</li></Link>
                            <Link to="/browsebook"><li className="hover:underline">Browse Books</li></Link>
                            <Link to="/addbooks"><li className="hover:underline">Add Book</li></Link>
                        </ul>
                    </div>

                    <div>
                        <h3 className={`font-semibold text-lg mb-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Categories</h3>
                        <ul className={`flex flex-col gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Link to="/books/fiction"><li className="hover:underline">Fiction</li></Link>
                            <Link to="/books/science"><li className="hover:underline">Science</li></Link>
                            <Link to="/books/fantacy"><li className="hover:underline">Fantasy</li></Link>
                        </ul>
                    </div>

                    <div>
                        <h3 className={`font-semibold text-lg mb-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Connect</h3>
                        <div className="flex gap-4 text-2xl">
                            <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                                <FaGithub />
                            </a>
                            <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                                <FaTwitter />
                            </a>
                            <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={`mt-8 pt-4 border-t ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-600'}`}>
                    <p className="text-sm">&copy; {new Date().getFullYear()} eBook Library. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;