import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBook, FaBookOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ReadingList = () => {
    const [readingList, setReadingList] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const isDark = useSelector((state) => state.darkMode.isDark);

    // For demonstration - will be replaced with API calls
    useEffect(() => {
        // Simulate loading reading list from localStorage or API
        const mockReadingList = [
            {
                id: '1',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                coverImage: 'https://covers.openlibrary.org/b/id/6424091-M.jpg',
                type: 'book',
                status: 'reading',
                progress: {
                    currentPage: 120,
                    totalPages: 180
                },
                userRating: 4,
                dateAdded: new Date('2023-01-15')
            },
            {
                id: '2',
                title: 'One Piece',
                author: 'Eiichiro Oda',
                coverImage: 'https://covers.openlibrary.org/b/id/8479047-M.jpg',
                type: 'manhwa',
                status: 'reading',
                progress: {
                    currentChapter: 950,
                    totalChapters: 1088
                },
                userRating: 5,
                dateAdded: new Date('2023-02-10')
            },
            {
                id: '3',
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                coverImage: 'https://covers.openlibrary.org/b/id/8764743-M.jpg',
                type: 'book',
                status: 'to-read',
                progress: {
                    currentPage: 0,
                    totalPages: 281
                },
                userRating: 0,
                dateAdded: new Date('2023-03-05')
            },
            {
                id: '4',
                title: 'Solo Leveling',
                author: 'Chugong',
                coverImage: 'https://covers.openlibrary.org/b/id/12842027-M.jpg',
                type: 'manhwa',
                status: 'completed',
                progress: {
                    currentChapter: 179,
                    totalChapters: 179
                },
                userRating: 5,
                dateAdded: new Date('2023-01-20')
            }
        ];

        setReadingList(mockReadingList);
    }, []);

    // Filter reading list based on active filter
    const filteredList = activeFilter === 'all'
        ? readingList
        : readingList.filter(book => book.status === activeFilter);

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
    const formatProgress = (book) => {
        if (book.type === 'book') {
            const percentage = book.progress.totalPages > 0
                ? Math.round((book.progress.currentPage / book.progress.totalPages) * 100)
                : 0;
            return `${book.progress.currentPage} / ${book.progress.totalPages} pages (${percentage}%)`;
        } else {
            const percentage = book.progress.totalChapters > 0
                ? Math.round((book.progress.currentChapter / book.progress.totalChapters) * 100)
                : 0;
            return `${book.progress.currentChapter} / ${book.progress.totalChapters} chapters (${percentage}%)`;
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
                        {filteredList.map(book => (
                            <div
                                key={book.id}
                                className={`p-4 rounded-lg shadow-md ${
                                    isDark ? 'bg-gray-800' : 'bg-white border border-gray-200'
                                }`}
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Book Cover */}
                                    <div className="w-full md:w-32 flex-shrink-0">
                                        <img
                                            src={book.coverImage}
                                            alt={book.title}
                                            className="w-full h-48 md:h-auto object-cover rounded"
                                        />
                                    </div>

                                    {/* Book Details */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-xl font-bold">{book.title}</h2>
                                            <div className="flex items-center gap-1">
                                                {getStatusIcon(book.status)}
                                                <span className={`text-sm ${
                                                    book.status === 'reading' ? 'text-blue-500' :
                                                        book.status === 'completed' ? 'text-green-500' :
                                                            book.status === 'dropped' ? 'text-red-500' :
                                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                          {book.status.charAt(0).toUpperCase() + book.status.slice(1).replace('-', ' ')}
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
                                            {book.userRating > 0 && (
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                          {'★'.repeat(book.userRating)}{'☆'.repeat(5 - book.userRating)}
                        </span>
                                            )}
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                            }`}>
                        Added: {formatDate(book.dateAdded)}
                      </span>
                                        </div>

                                        {/* Progress Bar */}
                                        {(book.status === 'reading' || book.status === 'completed') && (
                                            <div className="mb-3">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                                    <div
                                                        className="bg-blue-600 h-2.5 rounded-full"
                                                        style={{
                                                            width: book.type === 'book'
                                                                ? `${(book.progress.currentPage / book.progress.totalPages) * 100}%`
                                                                : `${(book.progress.currentChapter / book.progress.totalChapters) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {formatProgress(book)}
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
                                            <button className={`px-3 py-1 text-sm rounded ${
                                                isDark
                                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            }`}>
                                                Update Progress
                                            </button>
                                            <button className={`px-3 py-1 text-sm rounded ${
                                                isDark
                                                    ? 'bg-red-900 text-white hover:bg-red-800'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                            }`}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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