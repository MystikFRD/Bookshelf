import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Categories from "../../Components/Categories";
import Booksdata from "../../Components/Booksdata";
import { Link } from "react-router-dom";
import { getAllBooks } from "../../utils/api/bookService";
import { setBooks } from "../../utils/bookSlice";

// Import background directly if available
// Alternatively, use an online image that's guaranteed to work
const bannerBgStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2341&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center'
};

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isDark = useSelector(state => state.darkMode.isDark);
    const books = useSelector(state => state.book.books);
    const dispatch = useDispatch();

    // Fetch books on component mount
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                setError('');
                const fetchedBooks = await getAllBooks();

                // Store books in Redux store
                dispatch(setBooks(fetchedBooks));
            } catch (err) {
                console.error('Error fetching books:', err);
                setError('Error loading books. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        // Fetch books only if they haven't been loaded yet
        if (!books || books.length === 0) {
            fetchBooks();
        } else {
            setLoading(false);
        }
    }, [dispatch, books]);

    return (
        <div>
            <section style={bannerBgStyle} className="py-16 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-10 md:mb-0 bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">The Ultimate Library Management Tool</h1>
                            <p className="text-lg mb-8 text-white">Discover, organize, and enjoy your favorite books in one place.</p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/browsebook" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
                                    Browse Books
                                </Link>
                                <Link to="/addbooks" className="bg-white text-black px-6 py-3 rounded-full border-2 border-black hover:bg-gray-100 transition">
                                    Add New Book
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                                alt="Library Books"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <Categories />

                <div className="mt-16">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className={`inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid ${isDark ? 'border-blue-400' : 'border-blue-600'} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}></div>
                            <p className="text-lg mt-4">Loading books...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                            <p>{error}</p>
                            <button
                                onClick={() => dispatch(setBooks([]))}
                                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <Booksdata title="Featured Books" books={books} />
                    )}
                </div>

                <div className={`mt-16 rounded-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                    <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        About Our Library
                    </h2>
                    <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                        Our online library management system makes it easy to discover new books,
                        organize your collection, and keep track of your reading journey.
                    </p>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                        With features like category browsing, search functionality, and the ability to
                        add your own books, managing your library has never been easier.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;