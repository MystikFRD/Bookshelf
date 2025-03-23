import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaFilter, FaSort, FaSortAlphaDown, FaSortAlphaUp, FaTimesCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';

const SearchFilter = ({ onApplyFilters }) => {
    const isDark = useSelector(state => state.darkMode.isDark);
    const [isOpen, setIsOpen] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        genre: '',
        rating: 0,
        sortBy: 'title',
        sortOrder: 'asc'
    });

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle rating filter changes
    const handleRatingChange = (rating) => {
        setFilters(prev => ({
            ...prev,
            rating: rating
        }));
    };

    // Toggle sort order
    const toggleSortOrder = () => {
        setFilters(prev => ({
            ...prev,
            sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Apply filters
    const applyFilters = () => {
        onApplyFilters(filters);
        setIsOpen(false);
    };

    // Reset filters
    const resetFilters = () => {
        const defaultFilters = {
            genre: '',
            rating: 0,
            sortBy: 'title',
            sortOrder: 'asc'
        };
        setFilters(defaultFilters);
        onApplyFilters(defaultFilters);
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        isDark
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                >
                    <FaFilter />
                    <span>Filter Results</span>
                </button>

                {(filters.genre || filters.rating > 0 || filters.sortBy !== 'title' || filters.sortOrder !== 'asc') && (
                    <button
                        onClick={resetFilters}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                            isDark
                                ? 'bg-red-900 hover:bg-red-800 text-white'
                                : 'bg-red-100 hover:bg-red-200 text-red-800'
                        }`}
                    >
                        <FaTimesCircle />
                        <span>Reset Filters</span>
                    </button>
                )}
            </div>

            {/* Applied filters display */}
            {(filters.genre || filters.rating > 0 || filters.sortBy !== 'title' || filters.sortOrder !== 'asc') && (
                <div className={`flex flex-wrap items-center gap-2 p-3 rounded-md mb-3 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Applied Filters:
                    </span>

                    {filters.genre && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                            Genre: {filters.genre}
                        </span>
                    )}

                    {filters.rating > 0 && (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            Rating: {'★'.repeat(parseInt(filters.rating))}
                        </span>
                    )}

                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        isDark ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                    }`}>
                        Sort: {filters.sortBy} ({filters.sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                    </span>
                </div>
            )}

            {/* Filter panel */}
            {isOpen && (
                <div className={`p-4 rounded-lg shadow-md mb-4 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Genre filter */}
                        <div>
                            <label className={`block mb-2 font-medium ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Genre
                            </label>
                            <select
                                name="genre"
                                value={filters.genre}
                                onChange={handleFilterChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                }`}
                            >
                                <option value="">All Genres</option>
                                <option value="fiction">Fiction</option>
                                <option value="non_fiction">Non-Fiction</option>
                                <option value="science">Science</option>
                                <option value="fantacy">Fantasy</option>
                                <option value="crime">Crime</option>
                            </select>
                        </div>

                        {/* Rating filter */}
                        <div>
                            <label className={`block mb-2 font-medium ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Minimum Rating
                            </label>
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        className={`text-2xl focus:outline-none ${
                                            star <= filters.rating
                                                ? 'text-yellow-500'
                                                : isDark ? 'text-gray-600' : 'text-gray-300'
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}

                                {filters.rating > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRatingChange(0)}
                                        className={`ml-2 text-sm ${
                                            isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                                        }`}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Sort options */}
                        <div>
                            <label className={`block mb-2 font-medium ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Sort By
                            </label>
                            <div className="flex space-x-2">
                                <select
                                    name="sortBy"
                                    value={filters.sortBy}
                                    onChange={handleFilterChange}
                                    className={`flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="title">Title</option>
                                    <option value="author">Author</option>
                                    <option value="rating">Rating</option>
                                </select>

                                <button
                                    type="button"
                                    onClick={toggleSortOrder}
                                    className={`p-2 rounded-md ${
                                        isDark
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {filters.sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className={`px-4 py-2 rounded-md font-medium ${
                                isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

SearchFilter.propTypes = {
    onApplyFilters: PropTypes.func.isRequired
};

export default SearchFilter;