import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../utils/darkModeSlice';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeToggle = () => {
    const isDark = useSelector((state) => state.darkMode.isDark);
    const dispatch = useDispatch();

    return (
        <button
            onClick={() => dispatch(toggleDarkMode())}
            className={`p-2 rounded-full transition-colors ${
                isDark
                    ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
        </button>
    );
};

export default DarkModeToggle;