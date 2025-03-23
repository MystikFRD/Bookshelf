import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBook, FaBookOpen, FaCheckCircle, FaTimesCircle, FaSync, FaEdit, FaTrash } from 'react-icons/fa';
import { getUserReadingList, removeFromReadingList } from '../../utils/api/readingListService';

const ReadingList = () => {
    const [readingList, setReadingList] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [removeInProgress, setRemoveInProgress] = useState(null);

    const isDark = useSelector((state) => state.darkMode.isDark);
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const navigate = useNavigate();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/reading-list' } });
        }
    }, [isAuthenticated, navigate]);

    // Fetch user's reading list with auto-retry
    useEffect(() => {
        let isMounted = true;
        let retryTimeout = null;

        const fetchReadingList = async (retryAttempt = 0) => {
            if (!isAuthenticated || !isMounted) return;

            setLoading(true);
            if (retryAttempt === 0) {
                setError('');
            }

            try {
                // Add a small delay for initial request to allow auth to settle
                if (retryAttempt === 0) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                const list = await getUserReadingList();

                if (isMounted) {
                    setReadingList(list || []);
                    setError('');
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error fetching reading list:', err);

                if (isMounted) {
                    setError('Failed to load your reading list. Please try again.');
                    setLoading(false);

                    // Auto-retry once after 2 seconds
                    if (retryAttempt < 1) {
                        retryTimeout = setTimeout(() => {
                            fetchReadingList(retryAttempt + 1);
                        }, 2000);
                    }
                }
            }
        };

        // Only fetch when authenticated to prevent unnecessary API calls
        if (isAuthenticated) {
            fetchReadingList();
        } else {
            setLoading(false);
        }

        return () => {
            isMounted = false;
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, [isAuthenticated]);

    // Retry loading the reading list
    const handleRetry = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/reading-list' } });
            return;
        }

        setLoading(true);
        setError('');

        getUserReadingList()
            .then(list => {
                setReadingList(list || []);
                setError('');
            })
            .catch(err => {
                console.error('Error retrying reading list fetch:', err);
                setError('Failed to load your reading list. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Filter reading list based on active filter
    const filteredList = activeFilter === 'all'
        ? readingList
        : readingList.filter(item => item.status === activeFilter);

    // Handle removing a book from reading list
    const handleRemoveBook = async (readingListId) => {
        try {
            setRemoveInProgress(readingListId);
            await removeFromReadingList(readingListId);
            // Update the local state to remove the item
            setReadingList(prev => prev.filter(item => item.id !== readingListId));
        } catch (err) {
            console.error('Error removing book:', err);
            setError('Failed to remove book from your reading list.');
        } finally {
            setRemoveInProgress(null);
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
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

    // Calculate and format progress
    const formatProgress = (item) => {
        const book = item.expand?.book;
        if (!book) return 'N/A';

        if (book.type === 'book') {
            const percentage = item.totalPages > 0
                ? Math.round((item.currentPage / item.totalPages) * 100)
                : 0;
            return `${item.currentPage} / ${item.totalPages} pages (${percentage}%)`;
        } else {
            const percentage = item.totalChapters > 0
                ? Math.round((item.currentChapter / item.totalChapters) * 100)
                : 0;
            return `${item.currentChapter} / ${item.totalChapters} chapters (${percentage}%)`;
        }
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get image URL safely
    const getBookImage = (book) => {
        if (!book) return 'https://placehold.co/200x300/png?text=Book+Cover';

        // Check if it's a PocketBase book with an image
        if (book.image && typeof book.collectionId !== 'undefined') {
            try {
                return `https://db.momoh.de/api/files/${book.collectionId}/${book.id}/${book.image}`;
            } catch (e) {
                console.error('Error getting book image:', e);
            }
        }

        // Check for OpenLibrary cover
        if (book.cover_i) {
            return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        }

        // Check for direct image URL
        if (book.img) return book.img;

        // Fallback
        return `https://placehold.co/200x300/png?text=${encodeURIComponent(book.title || 'Book')}`;
    };

    if (loading) {
        return (
            <div className={`py-8 px-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <div className="flex flex-col items-center">
                    <div className={`inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid ${isDark ? 'border-blue-400' : 'border-blue-600'} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}></div>
                    <p className="mt-4">Loading your reading list...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`py-8 px-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">My Reading List</h1>

                    <div className={`p-6 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-50'} mb-6`}>
                        <p className={`mb-4 ${isDark ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
                        <button
                            onClick={handleRetry}
                            className={`flex items-center gap-2 px-4 py-2 rounded ${
                                isDark ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
                            }`}
                        >
                            <FaSync /> Try Again
                        </button>
                    </div>

                    <div className="mt-6">
                        <Link
                            to="/browsebook"
                            className={`px-4 py-2 rounded ${
                                isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            Browse Books
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`py-8 px-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Reading List</h1>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 rounded-full ${
                            activeFilter === 'all'
                                ? 'bg-blue-600 text-white'
                                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveFilter('reading')}
                        className={`px-4 py-2 rounded-full ${
                            activeFilter === 'reading'
                                ? 'bg-blue-600 text-white'
                                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Currently Reading
                    </button>
                    <button
                        onClick={() => setActiveFilter('to-read')}
                        className={`px-4 py-2 rounded-full ${
                            activeFilter === 'to-read'
                                ? 'bg-blue-600 text-white'
                                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        To Read
                    </button>
                    <button
                        onClick={() => setActiveFilter('completed')}
                        className={`px-4 py-2 rounded-full ${
                            activeFilter === 'completed'
                                ? 'bg-blue-600 text-white'
                                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setActiveFilter('dropped')}
                        className={`px-4 py-2 rounded-full ${
                            activeFilter === 'dropped'
                                ? 'bg-blue-600 text-white'
                                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Dropped
                    </button>
                </div>

                {/* Reading List */}
                {filteredList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredList.map(item => {
                            const book = item.expand?.book;
                            if (!book) return null;

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded-lg shadow-md ${
                                        isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row gap-4">
                                        {/* Book Cover */}
                                        <div className="w-full md:w-32 flex-shrink-0">
                                            <img
                                                src={getBookImage(book)}
                                                alt={book.title}
                                                className="w-full h-48 md:h-auto object-cover rounded"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://placehold.co/200x300/png?text=${encodeURIComponent(book.title || 'Book')}`;
                                                }}
                                            />
                                        </div>

                                        {/* Book Details */}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h2 className="text-xl font-bold">{book.title}</h2>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(item.status)}
                                                    <span className={`text-sm ${
                                                        item.status === 'reading' ? 'text-blue-500' :
                                                            item.status === 'completed' ? 'text-green-500' :
                                                                item.status === 'dropped' ? 'text-red-500' :
                                                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                                    }`}>
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                                {book.author}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                                }`}>
                                                    {book.type && typeof book.type === 'string'
                                                        ? book.type.charAt(0).toUpperCase() + book.type.slice(1)
                                                        : 'General'}
                                                </span>
                                                {book.rating > 0 && (
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {typeof book.rating === 'number' ? book.rating.toFixed(1) : book.rating} ★
                                                    </span>
                                                )}
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                                }`}>
                                                    Added: {item.dateAdded ? formatDate(item.dateAdded) : 'Unknown'}
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            {(item.status === 'reading' || item.status === 'completed') && (
                                                <div className="mb-3">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                                        <div
                                                            className="bg-blue-600 h-2.5 rounded-full"
                                                            style={{
                                                                width: book.type === 'book'
                                                                    ? `${(item.currentPage / Math.max(item.totalPages, 1)) * 100}%`
                                                                    : `${(item.currentChapter / Math.max(item.totalChapters, 1)) * 100}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {book.type === 'book'
                                                            ? `Page ${item.currentPage || 0} of ${item.totalPages || '?'}`
                                                            : `Chapter ${item.currentChapter || 0} of ${item.totalChapters || '?'}`}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mt-3">
                                                <Link
                                                    to={`/book/${book.id}`}
                                                    className="flex items-center gap-1 px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    <FaBook className="text-xs" /> View Details
                                                </Link>
                                                <Link
                                                    to={`/update-progress/${item.id}`}
                                                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded ${
                                                        isDark
                                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    <FaEdit className="text-xs" /> Update Progress
                                                </Link>
                                                <button
                                                    onClick={() => handleRemoveBook(item.id)}
                                                    disabled={removeInProgress === item.id}
                                                    className={`flex items-center gap-1 px-3 py-1 text-sm rounded ${
                                                        removeInProgress === item.id
                                                            ? 'bg-gray-400 cursor-not-allowed text-white'
                                                            : isDark
                                                                ? 'bg-red-900 text-white hover:bg-red-800'
                                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {removeInProgress === item.id ? (
                                                        <FaSync className="text-xs animate-spin" />
                                                    ) : (
                                                        <FaTrash className="text-xs" />
                                                    )}
                                                    {removeInProgress === item.id ? 'Removing...' : 'Remove'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={`p-8 text-center rounded-lg ${
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                        <h3 className="text-xl font-semibold mb-2">Your reading list is empty</h3>
                        <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Start adding books to keep track of your reading journey
                        </p>
                        <Link
                            to="/browsebook"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            Browse Books
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadingList;