import React from 'react';
import BookCard from './BookCard';

const Booksdata = ({ title = "Featured Books", books = [] }) => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                {books.length > 4 && (
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View All
                    </button>
                )}
            </div>

            {books && books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard key={book.key || book.id || Math.random().toString()} book={book} />
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-lg text-gray-500 mb-4">No books found.</p>
                    <p className="text-sm text-gray-400">Try searching for a different term or browse by category.</p>
                </div>
            )}
        </div>
    );
};

export default Booksdata;