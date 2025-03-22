import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import pb from '../../utils/pocketbaseClient';
import { handlePocketBaseError } from '../../utils/errorHandler';

const UpdateReadingProgress = () => {
    const { id } = useParams(); // reading list item ID
    const [readingItem, setReadingItem] = useState(null);
    const [formData, setFormData] = useState({
        status: 'reading',
        currentPage: 0,
        totalPages: 0,
        currentChapter: 0,
        totalChapters: 0
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const isDark = useSelector((state) => state.darkMode.isDark);
    const navigate = useNavigate();

    // Fetch reading list item data
    useEffect(() => {
        const fetchReadingItem = async () => {
            try {
                const record = await pb.collection('reading_list').getOne(id, {
                    expand: 'book'
                });

                setReadingItem(record);
                setFormData({
                    status: record.status,
                    currentPage: record.currentPage || 0,
                    totalPages: record.totalPages || 0,
                    currentChapter: record.currentChapter || 0,
                    totalChapters: record.totalChapters || 0
                });
            } catch (err) {
                console.error('Error fetching reading item:', err);
                setError(handlePocketBaseError(err) || 'Could not find the reading list item.');
            } finally {
                setLoading(false);
            }
        };

        fetchReadingItem();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'status' ? value : parseInt(value, 10) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await pb.collection('reading_list').update(id, {
                status: formData.status,
                currentPage: formData.currentPage,
                totalPages: formData.totalPages,
                currentChapter: formData.currentChapter,
                totalChapters: formData.totalChapters
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/reading-list');
            }, 2000);
        } catch (err) {
            console.error('Error updating progress:', err);
            setError(handlePocketBaseError(err) || 'Failed to update reading progress.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <p className={`text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>Loading...</p>
            </div>
        );
    }

    if (!readingItem) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <p className="text-center text-red-500">{error || 'Reading list item not found'}</p>
                <button
                    onClick={() => navigate('/reading-list')}
                    className="mt-4 block mx-auto px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Back to Reading List
                </button>
            </div>
        );
    }

    const book = readingItem.expand?.book;
    const isBook = !book?.type || book?.type === 'book';

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Update Reading Progress
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Progress updated successfully! Redirecting...
                </div>
            )}

            <div className={`flex items-center gap-4 mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {book && (
                    <>
                        <img
                            src={pb.getFileUrl(book, book.image)}
                            alt={book.title}
                            className="w-20 h-auto rounded"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{book.title}</h2>
                            <p className="text-sm">{book.author}</p>
                        </div>
                    </>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="status"
                        className={`block mb-2 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                        Reading Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
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

                {isBook ? (
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
                                value={formData.currentPage}
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
                                value={formData.totalPages}
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
                                value={formData.currentChapter}
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
                                value={formData.totalChapters}
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

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`px-4 py-2 rounded-md font-medium ${
                            submitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {submitting ? 'Updating...' : 'Save Progress'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/reading-list')}
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
    );
};

export default UpdateReadingProgress;