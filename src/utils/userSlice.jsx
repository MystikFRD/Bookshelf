import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;

            // Log the updated state for debugging
            console.log("User state updated:", {
                id: action.payload.id,
                username: action.payload.username,
                name: action.payload.name,
                isAuthenticated: true
            });
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            console.log("User state cleared");
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            console.error("User state error:", action.payload);
        },
    },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;