import React from "react";
import { Link } from "react-router-dom";
import { getBookCover } from "../utils/api/OpenLibrary_BookCover";

const BookCard = ({ book }) => {
    const coverUrl = book.cover_i
        ? getBookCover(book.cover_i)
        : "https://via.placeholder.com/150";

    return (
        <div className="p-2 border-2 border-gray-500 w-64 shadow-sm hover:scale-105 cursor-pointer h-fit">
            <img src={coverUrl} alt="book_image" className="w-full h-40" />
            <h3 className="font-semibold text-base font-Poppins mt-2">{book.title}</h3>
            <div className="flex gap-2 items-center mt-2 font-Poppins">
                <p className="bg-blue-50 border-2 border-blue-200 font-Poppins p-1 font-light text-Azure text-xs">
                    Author
                </p>
                <p className="text-Gray-500 font-medium text-sm font-Poppins">
                    {book.author_name?.join(", ") || "Unknown Author"}
                </p>
            </div>
            <p className="font-Poppins text-sm font-light mt-1">
                {book.description?.length >= 40
                    ? book.description.substring(0, 50) + "..."
                    : book.description || "No description available"}
            </p>
            <Link to={`/book/${book.key}`}>
                <button className="font-Poppins px-2 py-1.5 bg-black text-white text-xs float-right">
                    View details
                </button>
            </Link>
        </div>
    );
};

export default BookCard;
