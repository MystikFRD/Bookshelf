import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    books: [], // Liste der Bücher
    selectedBook: null, // Aktuell ausgewähltes Buch
};

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setBooks: (state, action) => {
            state.books = action.payload; // Setzt die Liste der Bücher
        },
        addBook: (state, action) => {
            state.books.push(action.payload); // Fügt ein neues Buch hinzu
        },
        selectBook: (state, action) => {
            state.selectedBook = action.payload; // Wählt ein Buch aus
        },
        clearSelectedBook: (state) => {
            state.selectedBook = null; // Löscht das ausgewählte Buch
        },
    },
});

export const { setBooks, addBook, selectBook, clearSelectedBook } = bookSlice.actions;
export default bookSlice.reducer;