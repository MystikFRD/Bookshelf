import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import pb from "../utils/pocketbaseClient";
import { addToReadingList } from '../utils/api/readingListService';
import { FaBook, FaCheck, FaTimes } from 'react-icons/fa';

/**
 * Modal component for adding a book to the user's reading list
 */
const AddToListModal = ({ book, isOpen, onClose, onSuccess }) => {
    const [status, setStatus] = useState('to-read');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const isDark = useSelector(state => state.darkMode.isDark);
    const { isAuthenticated } = useSelector(state => state.user);
    const navigate = useNavigate();

    // Only render if modal is open
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        setLoading(true);
        setError('');

        try {
            await addToReadingList(book.id, status);
            onSuccess && onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to add book to reading list.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Add to Reading List
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={book.img || book.cover_i ?
                                `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` :
                                `https://placehold.co/200x300/png?text=${encodeURIComponent(book.title)}`}
                            alt={book.title}
                            className="w-24 h-auto rounded"
                        />
                        <div>
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {book.title}
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {book.author || (book.author_name && book.author_name.join(', ')) || 'Unknown Author'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="status"
                            className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                            Reading Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                        >
                            <option value="to-read">To Read</option>
                            <option value="reading">Currently Reading</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {loading ? (
                                'Adding...'
                            ) : (
                                <>
                                    <FaBook /> Add to Reading List
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-md font-medium ${
                                isDark
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToListModal;