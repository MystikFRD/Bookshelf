import { createSlice } from '@reduxjs/toolkit';

// Check if dark mode is already set in localStorage
const getInitialDarkMode = () => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
        return JSON.parse(savedDarkMode);
    }

    // If not in localStorage, check user's system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: {
        isDark: typeof window !== 'undefined' ? getInitialDarkMode() : false,
    },
    reducers: {
        toggleDarkMode: (state) => {
            state.isDark = !state.isDark;
            // Save to localStorage when changed
            if (typeof window !== 'undefined') {
                localStorage.setItem('darkMode', JSON.stringify(state.isDark));
            }
        },
        setDarkMode: (state, action) => {
            state.isDark = action.payload;
            // Save to localStorage when changed
            if (typeof window !== 'undefined') {
                localStorage.setItem('darkMode', JSON.stringify(action.payload));
            }
        }
    }
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;