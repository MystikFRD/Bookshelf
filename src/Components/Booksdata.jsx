import React from 'react';
import BookCard from './BookCard';

const Booksdata = ({ title = "Featured Books", books = [] }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {books && books.length > 0 ? (
                    books.map((book) => <BookCard key={book.key || book.id} book={book} />)
                ) : (
                    <p>Keine Bücher gefunden.</p>
                )}
            </div>
        </div>
    );
};

export default Booksdata;