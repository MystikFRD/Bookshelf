import React from 'react';
import { useSelector } from 'react-redux';
import BookCard from "./BookCard";
import { useParams } from 'react-router-dom';

const BookPage = () => {
    const { category } = useParams(); // Korrigierte Schreibweise von "category"
    const bookDatas = useSelector(state => state.book.books); // Zugriff auf die Bücherliste aus Redux

    // Filtere die Bücher basierend auf der Kategorie
    const filterBook = bookDatas?.filter((book) => book.type.toLowerCase() === category.toLowerCase());

    return (
        <div className="p-10">
            <h2 className="font-medium text-3xl">Books in {category}</h2>
            <div className="mt-6 flex flex-wrap gap-5 items-center">
                {filterBook && filterBook.length > 0 ? (
                    filterBook.map((book) => (
                        <BookCard book={book} key={book.id} />
                    ))
                ) : (
                    <p className="text-lg text-gray-500">No books found in this category.</p>
                )}
            </div>
        </div>
    );
};

export default BookPage;
