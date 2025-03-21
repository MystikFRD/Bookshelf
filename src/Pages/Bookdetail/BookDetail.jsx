import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Booksdata from '../../Components/Booksdata';
import left_icon from '../../assets/left_icon.svg';

const BookDetail = () => {
    const { id } = useParams(); // Hole die Buch-ID aus der URL
    const bookDatas = useSelector(state => state.book.books); // Zugriff auf die Bücherliste aus Redux
    const book_data = bookDatas?.find(book => book.id === id); // Finde das Buch basierend auf der ID

    // Fallback, falls das Buch nicht gefunden wird
    if (!book_data) {
        return (
            <section className="p-5">
                <Link to="/browsebook">
                    <button className="px-3 py-1">
                        <img src={left_icon} alt="Zurück" className="w-7 h-7" />
                    </button>
                </Link>
                <div className="text-center mt-10">
                    <h2 className="text-2xl font-bold">Buch nicht gefunden</h2>
                    <p>Das angeforderte Buch existiert nicht oder wurde entfernt.</p>
                    <Link to="/browsebook" className="mt-5 inline-block px-4 py-2 bg-blue-500 text-white rounded">
                        Zurück zur Bücherliste
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="p-5">
            <Link to="/browsebook">
                <button className="px-3 py-1">
                    <img src={left_icon} alt="Zurück" className="w-7 h-7" />
                </button>
            </Link>
            <div className="flex md:flex-row flex-col justify-center gap-10 p-5 mt-5">
                <img src={book_data.img} alt="book_img" className="h-80 w-96" />
                <div>
                    <h2 className="font-semibold font-Poppins text-4xl mb-2">Title: {book_data.title}</h2>
                    <p className="font-base font-Poppins text-xl mb-2">Description: {book_data.description}</p>
                    <h4 className="text-lg font-semibold font-Poppins mb-2">
                        <span className="px-2 py-1 bg-black text-white font-medium text-base font-Poppins">Author</span>: {book_data.author}
                    </h4>
                    <p className="font-Poppins text-md font-medium mt-1 text-orange-500">Ratings: {book_data.rating}+</p>
                </div>
            </div>
            <Booksdata title={'See other books'} books={bookDatas.filter(book => book.id !== id)} />
        </section>
    );
};

export default BookDetail;
