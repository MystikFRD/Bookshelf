import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import BookCard from "./BookCard";
import { getBooksByCategory } from '../utils/api/bookService';

const BookPage = () => {
    const { category } = useParams();
    const bookDatas = useSelector(state => state.book.books);
    const [categoryBooks, setCategoryBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isDark = useSelector(state => state.darkMode.isDark);

    useEffect(() => {
        const fetchCategoryBooks = async () => {
            setLoading(true);
            setError(null);

            try {
                // First try to filter from existing books in Redux
                let filteredBooks = bookDatas?.filter(
                    book => book.type?.toLowerCase() === category.toLowerCase()
                );

                // If not enough books found, fetch from API
                if (!filteredBooks || filteredBooks.length < 3) {
                    const fetchedBooks = await getBooksByCategory(category);
                    setCategoryBooks(fetchedBooks);
                } else {
                    setCategoryBooks(filteredBooks);
                }
            } catch (err) {
                console.error(`Error fetching ${category} books:`, err);
                setError(`Failed to load ${category} books. Please try again later.`);
                setCategoryBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryBooks();
    }, [category, bookDatas]);

    if (loading) {
        return (
            <div className="p-10 text-center">
                <h2 className="font-medium text-3xl">Books in {category}</h2>
                <div className="mt-6">
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Loading {category} books...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10">
                <h2 className="font-medium text-3xl">Books in {category}</h2>
                <div className="mt-6">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <h2 className="font-medium text-3xl">Books in {category}</h2>
            <div className="mt-6 flex flex-wrap gap-5">
                {categoryBooks && categoryBooks.length > 0 ? (
                    categoryBooks.map(book => (
                        <div key={book.id || Math.random().toString()} className="w-full sm:w-auto sm:flex-1 md:w-1/3 lg:w-1/4 xl:w-1/5 min-w-[250px] max-w-[350px]">
                            <BookCard book={book} />
                        </div>
                    ))
                ) : (
                    <p className="text-lg text-gray-500">No books found in this category.</p>
                )}
            </div>
        </div>
    );
};

export default BookPage;