import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBook, FaBookOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getUserReadingList, removeFromReadingList } from '../../utils/api/readingListService';

const ReadingList = () => {
    const [readingList, setReadingList] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isDark = useSelector((state) => state.darkMode.isDark);
    const { isAuthenticated } = useSelector((state) => state.user);

    const navigate = useNavigate();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Fetch user's reading list
    useEffect(() => {
        const fetchReadingList = async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                const list = await getUserReadingList();
                setReadingList(list);
            } catch (err) {
                console.error('Error fetching reading list:', err);
                setError('Failed to load your reading list. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchReadingList();
    }, [isAuthenticated]);

    // Filter reading list based on active filter
    const filteredList = activeFilter === 'all'
        ? readingList
        : readingList.filter(item => item.status === activeFilter);

    // Handle removing a book from reading list
    const handleRemoveBook = async (readingListId) => {
        try {
            await removeFromReadingList(readingListId);
            // Update the local state to remove the item
            setReadingList(prev => prev.filter(item => item.id !== readingListId));
        } catch (err) {
            console.error('Error removing book:', err);
            setError('Failed to remove book from your reading list.');
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

    if (loading) {
        return (
            <div className={`py-8 px-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <p>Loading your reading list...</p>
            </div>
        );
    }

    return (
        <div className={`py-8 px-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Reading List</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

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
                                                src={pb.getFileUrl(book, book.image)}
                                                alt={book.title}
                                                className="w-full h-48 md:h-auto object-cover rounded"
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
                                                    {book.type.charAt(0).toUpperCase() + book.type.slice(1)}
                                                </span>
                                                {book.rating > 0 && (
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {book.rating.toFixed(1)} ★
                                                    </span>
                                                )}
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                                }`}>
                                                    Added: {formatDate(item.dateAdded)}
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
                                                                    ? `${(item.currentPage / item.totalPages) * 100}%`
                                                                    : `${(item.currentChapter / item.totalChapters) * 100}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {formatProgress(item)}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mt-3">
                                                <Link
                                                    to={`/book/${book.id}`}
                                                    className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    View Details
                                                </Link>
                                                <Link
                                                    to={`/update-progress/${item.id}`}
                                                    className={`px-3 py-1 text-sm rounded ${
                                                        isDark
                                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                    }`}
                                                >
                                                    Update Progress
                                                </Link>
                                                <button
                                                    onClick={() => handleRemoveBook(item.id)}
                                                    className={`px-3 py-1 text-sm rounded ${
                                                        isDark
                                                            ? 'bg-red-900 text-white hover:bg-red-800'
                                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    }`}
                                                >
                                                    Remove
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