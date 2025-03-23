import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from 'prop-types';

const BookCard = ({ book }) => {
    const isDark = useSelector(state => state.darkMode.isDark);
    const [imageError, setImageError] = useState(false);

    // Default image if no book or if book data is incomplete
    if (!book || !book.title) {
        return null;
    }

    // Handle possible image sources - prioritize direct img URL if available
    const defaultCover = `https://placehold.co/400x600/png?text=${encodeURIComponent(book.title || 'Book')}`;
    const coverUrl = imageError ? defaultCover :
        (book.img ||
            (book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` :
                defaultCover));

    // Extract book ID - handle both local and API books
    const bookId = book.id || (book.key ? book.key.split('/').pop() : 'unknown');

    // Handle missing book type
    const bookType = book.type || (book.subject && book.subject[0] ? book.subject[0] : "General");

    // Handle author display
    const authorDisplay = book.author || (book.author_name ? book.author_name.join(", ") : "Unknown Author");

    // Handle rating display
    const ratingValue = book.rating ? Math.floor(book.rating) : 0;

    return (
        <div className={`overflow-hidden shadow-lg border transition-transform hover:scale-105 hover:shadow-xl rounded-lg ${
            isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
        }`}>
            <div className="h-48 overflow-hidden">
                <img
                    src={coverUrl}
                    alt={book.title || "Book Cover"}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />
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

                <Link
                    to={`/book/${bookId}`}
                    className={`block w-full text-center py-2 rounded transition ${
                        isDark
                            ? 'bg-blue-700 hover:bg-blue-600 text-white'
                            : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                >
                    View Details
                </Link>
            </div>
        </div>
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