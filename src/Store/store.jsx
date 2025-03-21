import { configureStore } from "@reduxjs/toolkit";
import bookSlice, { setBooks } from "../utils/bookSlice";
import darkModeReducer from "../utils/darkModeSlice";

// Initial book data
const initialBooks = [
    {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A novel about the American Dream set in the Roaring Twenties.",
        img: "https://covers.openlibrary.org/b/id/6424091-M.jpg",
        type: "fiction",
        rating: 4.5
    },
    {
        id: "2",
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        description: "A landmark book on cosmology and the universe.",
        img: "https://covers.openlibrary.org/b/id/8406786-M.jpg",
        type: "science",
        rating: 4.8
    },
    {
        id: "3",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description: "A romantic novel of manners.",
        img: "https://covers.openlibrary.org/b/id/6389316-M.jpg",
        type: "fiction",
        rating: 4.7
    },
    {
        id: "4",
        title: "Murder on the Orient Express",
        author: "Agatha Christie",
        description: "A detective novel featuring Hercule Poirot.",
        img: "https://covers.openlibrary.org/b/id/6878293-M.jpg",
        type: "crime",
        rating: 4.6
    },
    {
        id: "5",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        description: "A fantasy novel and prequel to The Lord of the Rings.",
        img: "https://covers.openlibrary.org/b/id/6979861-M.jpg",
        type: "fantasy",
        rating: 4.9
    }
];

const store = configureStore({
    reducer: {
        book: bookSlice,
        darkMode: darkModeReducer
    }
});

// Initialize the store with books
store.dispatch(setBooks(initialBooks));

export default store;