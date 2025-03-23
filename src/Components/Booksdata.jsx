import React from 'react';
import BookCard from './BookCard';
import { useSelector } from 'react-redux';

const Booksdata = ({ title = "Featured Books", books = [] }) => {
    const isDark = useSelector(state => state.darkMode.isDark);

    // Make sure we're working with a valid array
    const validBooks = Array.isArray(books) ? books : [];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
                {validBooks.length > 4 && (
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View All
                    </button>
                )}
            </div>

            {validBooks && validBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {validBooks.map((book, index) => (
                        <BookCard
                            key={book.key || book.id || `book-${index}-${Math.random().toString(36).substring(2, 9)}`}
                            book={book}
                        />
                    ))}
                </div>
            ) : (
                <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-8 text-center`}>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-500'} mb-4`}>No books found.</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Try searching for a different term or browse by category.</p>
                </div>
            )}
        </div>
    );
};

export default Booksdata;