import React from "react";
import { Link } from "react-router-dom";
import { getBookCover } from "../utils/api/OpenLibrary_BookCover";
import { useSelector } from "react-redux";

const BookCard = ({ book }) => {
    const isDark = useSelector(state => state.darkMode.isDark);

    // Handle both API books and local books
    const coverUrl = book.img ||
        (book.cover_i ? getBookCover(book.cover_i) :
            "https://via.placeholder.com/150");

    // Extract book ID - handle both local and API books
    const bookId = book.id || (book.key ? book.key.split('/').pop() : 'unknown');

    return (
        <div className={`overflow-hidden shadow-lg border transition-transform hover:scale-105 hover:shadow-xl rounded-lg ${
            isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
        }`}>
            <div className="h-48 overflow-hidden">
                <img
                    src={coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
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
                        {book.type || (book.subject ? book.subject[0] : "General")}
                    </span>
                    {book.rating && (
                        <span className="ml-2 text-yellow-500 flex">
                            {'★'.repeat(Math.floor(book.rating))}
                            <span className="text-gray-500">{'★'.repeat(5-Math.floor(book.rating))}</span>
                        </span>
                    )}
                </div>

                <p className={`text-sm mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    <span className="font-medium">Author: </span>
                    {book.author || book.author_name?.join(", ") || "Unknown Author"}
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

export default BookCard;