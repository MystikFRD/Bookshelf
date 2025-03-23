import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { FaPlus, FaBookOpen } from 'react-icons/fa';
import AddToListModal from "./AddToListModal";

const BookCard = ({ book }) => {
    const isDark = useSelector(state => state.darkMode.isDark);
    const [imageError, setImageError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAuthenticated } = useSelector(state => state.user);

    // Default image if no book or if book data is incomplete
    if (!book || !book.title) {
        return null;
    }

    // Extract book ID - handle both local and API books
    const bookId = book.id || (book.key ? book.key.split('/').pop() : 'unknown');

    // Handle missing book type
    const bookType = book.type || (book.subject && book.subject[0] ? book.subject[0] : "General");

    // Handle author display
    const authorDisplay = book.author || (book.author_name ? book.author_name.join(", ") : "Unknown Author");

    // Handle rating display
    const ratingValue = book.rating ? Math.floor(book.rating) : 0;

    // Get the correct image URL
    let coverUrl = '';
    if (book.img) {
        // Use the direct image URL if available
        coverUrl = book.img;
    } else if (book.cover_i) {
        // Use OpenLibrary cover if cover_i exists
        coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    } else {
        // Fallback image
        coverUrl = "https://via.placeholder.com/150?text=No+Cover";
    }

    // If we've tried loading the image and it failed, use a fallback
    if (imageError) {
        coverUrl = "https://via.placeholder.com/150?text=No+Cover";
    }

    // Open the modal when the "Add to List" button is clicked
    const handleAddToList = (e) => {
        e.preventDefault(); // Prevent navigating to detail page
        setIsModalOpen(true);
    };

    return (
        <>
            <div className={`overflow-hidden shadow-lg border transition-transform hover:scale-105 hover:shadow-xl rounded-lg ${
                isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
            }`}>
                <div className="h-48 overflow-hidden relative group">
                    <img
                        src={coverUrl}
                        alt={book.title || "Book Cover"}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />

                    {/* Add to list button overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <button
                            onClick={handleAddToList}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition-transform transform translate-y-4 group-hover:translate-y-0"
                        >
                            <FaPlus className="mr-2" />
                            Add to List
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className={`font-bold text-lg mb-2 line-clamp-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        {book.title}
                    </h3>

                    <div className="flex items-center mb-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                            {typeof bookType === 'string' ? bookType : "General"}
                        </span>
                        {book.rating && (
                            <span className="ml-2 text-yellow-500 flex">
                                {'★'.repeat(ratingValue)}
                                <span className="text-gray-500">{'★'.repeat(5 - ratingValue)}</span>
                            </span>
                        )}
                    </div>

                    <p className={`text-sm mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        <span className="font-medium">Author: </span>
                        {authorDisplay}
                    </p>

                    <p className={`text-sm mb-4 line-clamp-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        {book.description || "No description available"}
                    </p>

                    <div className="flex space-x-2">
                        <Link
                            to={`/book/${bookId}`}
                            className={`flex-1 block text-center py-2 rounded transition ${
                                isDark
                                    ? 'bg-blue-700 hover:bg-blue-600 text-white'
                                    : 'bg-black hover:bg-gray-800 text-white'
                            }`}
                        >
                            View Details
                        </Link>

                        <button
                            onClick={handleAddToList}
                            className={`px-3 py-2 rounded transition flex items-center justify-center ${
                                isDark
                                    ? 'bg-green-700 hover:bg-green-600 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                            title="Add to Reading List"
                        >
                            <FaBookOpen />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add to List Modal */}
            <AddToListModal
                book={book}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

// Define prop types for validation
BookCard.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.string,
        key: PropTypes.string,
        title: PropTypes.string,
        author: PropTypes.string,
        author_name: PropTypes.arrayOf(PropTypes.string),
        type: PropTypes.string,
        description: PropTypes.string,
        subject: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string
        ]),
        img: PropTypes.string,
        cover_i: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired
};

export default BookCard;