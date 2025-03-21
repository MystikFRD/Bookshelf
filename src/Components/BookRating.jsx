import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const BookRating = ({ bookId, initialRating = 0 }) => {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const isDark = useSelector((state) => state.darkMode.isDark);

    // This is a placeholder function - you'll replace it with real API calls later
    const handleSubmitRating = (e) => {
        e.preventDefault();

        // Log the data that would be sent to the server
        console.log('Rating submitted:', {
            bookId,
            rating,
            review
        });

        // Show success message
        setSubmitted(true);

        // Reset after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Rate this Book
            </h3>

            {submitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Your rating has been submitted successfully!
                </div>
            ) : (
                <form onSubmit={handleSubmitRating}>
                    <div className="flex mb-4">
                        {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;

                            return (
                                <button
                                    type="button"
                                    key={starValue}
                                    className={`text-2xl focus:outline-none ${
                                        starValue <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-300'
                                    }`}
                                    onClick={() => setRating(starValue)}
                                    onMouseEnter={() => setHoverRating(starValue)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <FaStar />
                                </button>
                            );
                        })}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="review"
                            className={`block mb-2 font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                        >
                            Your Review (Optional)
                        </label>
                        <textarea
                            id="review"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                isDark
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                            }`}
                            rows="3"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your thoughts about this book..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-md font-medium ${
                            rating === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        disabled={rating === 0}
                    >
                        Submit Rating
                    </button>
                </form>
            )}

            <div className="mt-6">
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Community Ratings
                </h4>

                {/* This is dummy data - you'll replace it with real data later */}
                <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center mb-2">
                        <div className="flex text-yellow-500">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar className="text-gray-300" />
                        </div>
                        <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              4.0 (12 ratings)
            </span>
                    </div>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        Ratings from OpenLibrary and users of this site will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookRating;