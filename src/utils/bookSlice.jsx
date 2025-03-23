import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    books: [], // List of all books
    selectedBook: null, // Currently selected book
    loading: false,
    error: null
};

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setBooks: (state, action) => {
            state.books = action.payload;
            state.error = null;
        },
        addBook: (state, action) => {
            state.books.push(action.payload);
        },
        selectBook: (state, action) => {
            state.selectedBook = action.payload;
        },
        clearSelectedBook: (state) => {
            state.selectedBook = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const {
    setBooks,
    addBook,
    selectBook,
    clearSelectedBook,
    setLoading,
    setError
} = bookSlice.actions;

export default bookSlice.reducer;