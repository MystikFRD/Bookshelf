import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaBookOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getUserReadingList, updateReadingProgress, addToReadingList } from '../utils/api/readingListService';

const ReadingTracker = ({ bookId, bookType = 'book' }) => {
    const [status, setStatus] = useState('to-read');
    const [progress, setProgress] = useState({
        currentPage: 0,
        totalPages: 0,
        currentChapter: 0,
        totalChapters: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [readingListItem, setReadingListItem] = useState(null);

    const isDark = useSelector((state) => state.darkMode.isDark);
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Fetch user's existing reading data for this book
    useEffect(() => {
        const fetchReadingData = async () => {
            if (!isAuthenticated || !bookId) {
                setLoading(false);
                return;
            }

            try {
                const readingList = await getUserReadingList();
                const bookEntry = readingList.find(item => {
                    const itemBookId = item.expand?.book?.id || item.book;
                    return itemBookId === bookId;
                });

                if (bookEntry) {
                    setReadingListItem(bookEntry);
                    setStatus(bookEntry.status || 'to-read');
                    setProgress({
                        currentPage: bookEntry.currentPage || 0,
                        totalPages: bookEntry.totalPages || 0,
                        currentChapter: bookEntry.currentChapter || 0,
                        totalChapters: bookEntry.totalChapters || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching reading data:', error);
                setError('Failed to load reading progress');
            } finally {
                setLoading(false);
            }
        };

        fetchReadingData();
    }, [isAuthenticated, bookId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'status') {
            setStatus(value);
        } else {
            setProgress({
                ...progress,
                [name]: parseInt(value, 10) || 0
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        setError('');
        setSaveSuccess(false);

        try {
            if (readingListItem) {
                // Update existing reading list entry
                await updateReadingProgress(
                    readingListItem.id,
                    status,
                    progress
                );
            } else {
                // Create new reading list entry
                const newItem = await addToReadingList(
                    bookId,
                    status,
                    progress
                );
                setReadingListItem(newItem);
            }

            // Show success message and close edit mode
            setSaveSuccess(true);
            setIsEditing(false);

            // Reset success message after 3 seconds
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error saving reading progress:', err);
            setError(err.message || 'Failed to save reading progress');
        }
    };

    // Calculate progress percentage
    const calculateProgress = () => {
        if (bookType === 'book') {
            return progress.totalPages > 0
                ? Math.round((progress.currentPage / progress.totalPages) * 100)
                : 0;
        } else {
            return progress.totalChapters > 0
                ? Math.round((progress.currentChapter / progress.totalChapters) * 100)
                : 0;
        }
    };

    const progressPercentage = calculateProgress();

    // Get status icon
    const getStatusIcon = () => {
        switch (status) {
            case 'to-read':
                return <FaBook className="text-gray-500" />;
            case 'reading':
                return <FaBookOpen className="text-blue-500" />;
            case 'completed':
                return <FaCheckCircle className="text-green-500" />;
            case 'dropped':
                return <FaTimesCircle className="text-red-500" />;
            default:
                return <FaBook className="text-gray-500" />;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Reading Progress
                </h3>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Please <button
                    onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
                    className="text-blue-500 hover:underline"
                >
                    log in
                </button> to track your reading progress for this book.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Reading Progress
                </h3>
                <div className={`flex justify-center py-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid ${isDark ? 'border-blue-400' : 'border-blue-600'} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}></div>
                    <span className="ml-2">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Reading Progress
                </h3>

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Update
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {saveSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Progress saved successfully!
                </div>
            )}

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="status"
                            className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                            Reading Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                        >
                            <option value="to-read">To Read</option>
                            <option value="reading">Currently Reading</option>
                            <option value="completed">Completed</option>
                            <option value="dropped">Dropped</option>
                        </select>
                    </div>

                    {bookType === 'book' ? (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label
                                    htmlFor="currentPage"
                                    className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                    Current Page
                                </label>
                                <input
                                    type="number"
                                    id="currentPage"
                                    name="currentPage"
                                    min="0"
                                    value={progress.currentPage}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                    }`}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="totalPages"
                                    className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                    Total Pages
                                </label>
                                <input
                                    type="number"
                                    id="totalPages"
                                    name="totalPages"
                                    min="0"
                                    value={progress.totalPages}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                    }`}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label
                                    htmlFor="currentChapter"
                                    className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                    Current Chapter
                                </label>
                                <input
                                    type="number"
                                    id="currentChapter"
                                    name="currentChapter"
                                    min="0"
                                    value={progress.currentChapter}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                    }`}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="totalChapters"
                                    className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                >
                                    Total Chapters
                                </label>
                                <input
                                    type="number"
                                    id="totalChapters"
                                    name="totalChapters"
                                    min="0"
                                    value={progress.totalChapters}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                        isDark
                                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                                    }`}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Save Progress
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className={`px-4 py-2 rounded-md font-medium ${
                                isDark
                                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        {getStatusIcon()}
                        <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            Status: {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </span>
                    </div>

                    {bookType === 'book' ? (
                        <div className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {progress.currentPage > 0 && (
                                <p>Page {progress.currentPage} of {progress.totalPages || '?'}</p>
                            )}
                        </div>
                    ) : (
                        <div className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {progress.currentChapter > 0 && (
                                <p>Chapter {progress.currentChapter} of {progress.totalChapters || '?'}</p>
                            )}
                        </div>
                    )}

                    {(progress.currentPage > 0 || progress.currentChapter > 0) && (
                        <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <p className={`text-right text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {progressPercentage}% complete
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReadingTracker;