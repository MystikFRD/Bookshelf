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
        selectBook: (state, action) => {
            state.selectedBook = action.payload; // Wählt ein Buch aus
        },
        clearSelectedBook: (state) => {
            state.selectedBook = null; // Löscht das ausgewählte Buch
        },
    },
});

export const { setBooks, selectBook, clearSelectedBook } = bookSlice.actions;
export default bookSlice.reducer;
