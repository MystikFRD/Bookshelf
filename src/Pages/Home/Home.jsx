import React from "react";
import { useSelector } from "react-redux";
import Categories from "../../Components/Categories";
import Booksdata from "../../Components/Booksdata";
import { Link } from "react-router-dom";

const Home = () => {
    // Get books from Redux store
    const books = useSelector(state => state.book.books);
    const isDark = useSelector(state => state.darkMode.isDark);

    return (
        <div>
            <section className="bg-bgBanner bg-cover bg-center py-16 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">The Ultimate Library Management Tool</h1>
                            <p className="text-lg mb-8">Discover, organize, and enjoy your favorite books in one place.</p>
                            <div className="flex space-x-4">
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
                    <Booksdata title="Featured Books" books={books} />
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