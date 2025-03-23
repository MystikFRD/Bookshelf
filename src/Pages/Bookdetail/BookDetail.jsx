import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Booksdata from '../../Components/Booksdata';
import { getBookById } from '../../utils/api/bookService';
import { FaArrowLeft } from 'react-icons/fa';

const BookDetail = () => {
    const { id } = useParams();
    const bookDatas = useSelector(state => state.book.books);
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState(false);
    const isDark = useSelector(state => state.darkMode.isDark);

    useEffect(() => {
        const fetchBookDetails = async () => {
            setLoading(true);
            setError('');
            setImageError(false);

            try {
                // First check if the book is in our Redux store
                const storedBook = bookDatas?.find(book => book.id === id);

                if (storedBook) {
                    setBookData(storedBook);
                } else {
                    // If not in Redux store, fetch from API
                    const fetchedBook = await getBookById(id);
                    setBookData(fetchedBook);
                }
            } catch (err) {
                console.error('Error fetching book details:', err);
                setError('Failed to load book details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id, bookDatas]);

    // Render loading state
    if (loading) {
        return (
            <section className="p-5 text-center">
                <Link to="/browsebook" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <FaArrowLeft /> Back to Books
                </Link>
                <div className="mt-10">
                    <div className={`inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid ${isDark ? 'border-blue-400' : 'border-blue-600'} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}></div>
                    <p className="text-xl mt-4">Loading book details...</p>
                </div>
            </section>
        );
    }

    // Render error state
    if (error || !bookData) {
        return (
            <section className="p-5">
                <Link to="/browsebook" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <FaArrowLeft /> Back to Books
                </Link>
                <div className="text-center mt-10">
                    <h2 className="text-2xl font-bold">Book not found</h2>
                    <p>{error || "The requested book does not exist or was removed."}</p>
                    <Link to="/browsebook" className="mt-5 inline-block px-4 py-2 bg-blue-500 text-white rounded">
                        Back to Book List
                    </Link>
                </div>
            </section>
        );
    }

    // Make sure we have an image URL with fallback
    const defaultCover = `https://placehold.co/400x600/png?text=${encodeURIComponent(bookData.title || 'Book')}`;
    const coverUrl = imageError ? defaultCover :
        (bookData.img ||
            (bookData.cover_i ? `https://covers.openlibrary.org/b/id/${bookData.cover_i}-L.jpg` :
                defaultCover));

    return (
        <section className="p-5">
            <Link to="/browsebook" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <FaArrowLeft /> Back to Books
            </Link>
            <div className="flex md:flex-row flex-col justify-center gap-10 p-5 mt-5">
                <img
                    src={coverUrl}
                    alt={bookData.title}
                    className="h-80 w-96 object-cover rounded shadow-lg"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />
                <div className={isDark ? 'text-white' : 'text-black'}>
                    <h2 className="font-semibold text-4xl mb-4">
                        {bookData.title}
                    </h2>
                    <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mr-2 mb-2 ${
                            isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        }`}>
                            {bookData.type || (bookData.subject && bookData.subject[0]) || "General"}
                        </span>
                    </div>
                    <h4 className="text-lg font-semibold mb-3">
                        <span className="font-medium">Author: </span>
                        {bookData.author || "Unknown Author"}
                    </h4>
                    <div className="mb-4">
                        <p className="text-lg">
                            {bookData.description || "No description available"}
                        </p>
                    </div>
                    {bookData.rating && (
                        <p className={`font-medium mt-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            Ratings: {typeof bookData.rating === 'number' ? bookData.rating.toFixed(1) : bookData.rating}
                            <span className="ml-2 text-yellow-500">
                                {'★'.repeat(Math.floor(bookData.rating || 0))}
                                <span className="text-gray-400">{'★'.repeat(5-Math.floor(bookData.rating || 0))}</span>
                            </span>
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-12">
                <Booksdata
                    title='You might also like'
                    books={bookDatas.filter(book => book.id !== id).slice(0, 4)}
                />
            </div>
        </section>
    );
};

export default BookDetail;