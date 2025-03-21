import React from 'react';
import { useSelector } from 'react-redux';

const Searchfield = ({ handleText }) => {
    const isDark = useSelector((state) => state.darkMode.isDark);

    const handleSearch = (inputValue) => {
        handleText(inputValue);
    };

    return (
        <div className='flex items-center justify-center gap-4 mt-4'>
            <input
                type="text"
                placeholder='Search by Book name or Author'
                className={`pl-4 pr-7 md:w-1/2 w-full h-14 outline-none border-2 ${
                    isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-500 text-gray-900 placeholder-gray-500'
                }`}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
};

export default Searchfield;