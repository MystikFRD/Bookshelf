import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addBook } from '../../utils/api/bookService';

const AddBooks = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        type: '',
        image: null,
        description: '',
    });

    const isDark = useSelector((state) => state.darkMode.isDark);
    const { isAuthenticated } = useSelector((state) => state.user);

    const navigate = useNavigate();

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        setBookData({
            ...bookData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { title, author, image, description, type } = bookData;

        if (!title || !author || !image || !description || !type) {
            setError('Please ensure all fields are filled in');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await addBook(bookData);
            navigate('/browsebook');
        } catch (err) {
            setError(err.message || 'Error adding book. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className={`md:w-1/2 w-full font-Poppins p-12 mx-auto ${
                isDark ? 'text-white' : 'text-gray-900'
            }`}
            onSubmit={handleSubmit}
        >
            <h2 className="font-semibold text-2xl mb-4 text-center">Add new Book</h2>
            <div className="mb-4">
                <label className={`font-medium text-lg mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Title
                </label>
                <input
                    type="text"
                    name="title"
                    value={bookData.title}
                    onChange={handleChange}
                    placeholder="Enter a Title of Book"
                    className={`w-full h-12 pl-2 pr-5 border-2 outline-none ${
                        isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-black text-gray-900 placeholder-gray-500'
                    }`}
                />
            </div>
            <div className="mb-4">
                <label className={`font-medium text-lg mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Author
                </label>
                <input
                    type="text"
                    name="author"
                    value={bookData.author}
                    onChange={handleChange}
                    placeholder="Enter an Author"
                    className={`w-full h-12 pl-2 pr-5 border-2 outline-none ${
                        isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-black text-gray-900 placeholder-gray-500'
                    }`}
                />
            </div>
            <div className="mb-4">
                <label className={`font-medium text-lg mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Book Type
                </label>
                <select
                    name="type"
                    value={bookData.type}
                    onChange={handleChange}
                    className={`w-full h-12 pl-2 pr-5 border-2 outline-none ${
                        isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-black text-gray-900'
                    }`}
                >
                    <option value="">Select a category</option>
                    <option value="fiction">Fiction</option>
                    <option value="non_fiction">Non-Fiction</option>
                    <option value="science">Science</option>
                    <option value="fantacy">Fantasy</option>
                    <option value="crime">Crime</option>
                </select>
            </div>
            <div className="mb-4">
                <label className={`font-medium text-lg mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Description
                </label>
                <textarea
                    name="description"
                    value={bookData.description}
                    onChange={handleChange}
                    placeholder="Enter a description"
                    className={`w-full pl-2 pr-5 border-2 outline-none ${
                        isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-black text-gray-900 placeholder-gray-500'
                    }`}
                    rows="5"
                ></textarea>
            </div>
            <div className="mb-4">
                <label className={`font-medium text-lg mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Upload an Image
                </label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className={`w-full p-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-900'
                    }`}
                />
            </div>
            {error && <p className="font-medium text-red-500 text-base mb-4">{error}</p>}
            <button
                type="submit"
                className={`px-6 py-2 ${
                    loading
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-semibold`}
                disabled={loading}
            >
                {loading ? 'Adding book...' : 'Add book'}
            </button>
        </form>
    );
};

export default AddBooks;