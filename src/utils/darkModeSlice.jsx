import { createSlice } from '@reduxjs/toolkit';

// Check if dark mode is already set in localStorage
const getInitialDarkMode = () => {
    if (typeof window === 'undefined') return false;

    try {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
            return JSON.parse(savedDarkMode);
        }

        // If not in localStorage, check user's system preference
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
        console.error('Error reading dark mode preference:', error);
        return false;
    }
};

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState: {
        isDark: getInitialDarkMode(),
    },
    reducers: {
        toggleDarkMode: (state) => {
            state.isDark = !state.isDark;
            // Save to localStorage when changed
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('darkMode', JSON.stringify(state.isDark));
                } catch (error) {
                    console.error('Error saving dark mode preference:', error);
                }
            }
        },
        setDarkMode: (state, action) => {
            state.isDark = action.payload;
            // Save to localStorage when changed
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('darkMode', JSON.stringify(action.payload));
                } catch (error) {
                    console.error('Error saving dark mode preference:', error);
                }
            }
        }
    }
});

export const { toggleDarkMode, setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;