import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { useSelector } from "react-redux";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isDark = useSelector((state) => state.darkMode.isDark);

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
                    <li><DarkModeToggle /></li>
                </ul>

                <div className="md:hidden flex items-center gap-3">
                    <DarkModeToggle />
                    <HiOutlineMenu className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'}`} onClick={() => setIsOpen(!isOpen)} />
                </div>
            </div>
            <div className="p-2">
                {isOpen && (
                    <ul className={`md:hidden flex flex-col justify-start gap-5 rounded-md w-full text-medium font-base cursor-pointer p-3 ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
                    }`}>
                        <Link to='/' onClick={() => setIsOpen(false)}><li className="hover:text-blue-500 transition">Home</li></Link>
                        <Link to='/browsebook' onClick={() => setIsOpen(false)}><li className="hover:text-blue-500 transition">Browse Book</li></Link>
                        <Link to="/addbooks" onClick={() => setIsOpen(false)}><li className="hover:text-blue-500 transition">Add books</li></Link>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;