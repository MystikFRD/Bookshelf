import { configureStore } from "@reduxjs/toolkit";
import bookSlice from "../utils/bookSlice";
import darkModeReducer from "../utils/darkModeSlice";
import userReducer from "../utils/userSlice";

const store = configureStore({
    reducer: {
        book: bookSlice,
        darkMode: darkModeReducer,
        user: userReducer
    }
});

export default store;
