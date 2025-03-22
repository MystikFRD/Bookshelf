import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import store from './Store/store'
import router from './router'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </Provider>
    </React.StrictMode>
)

// 5. Pocketbase Client Initialization with Auth Persistence
// Modify: src/utils/pocketbaseClient.js

import PocketBase from 'pocketbase';

// Initialize PocketBase client with persistence
const pb = new PocketBase('https://your-pocketbase-server.com');

// Load auth state from localStorage on page load
// This ensures authentication state persists across page refreshes
if (typeof window !== 'undefined') {
    // Check if there's a stored auth state
    const storedAuthState = localStorage.getItem('pocketbase_auth');

    if (storedAuthState) {
        try {
            const { token, model } = JSON.parse(storedAuthState);
            pb.authStore.save(token, model);
        } catch (error) {
            console.error('Error restoring auth state:', error);
            // Clear invalid auth state
            localStorage.removeItem('pocketbase_auth');
        }
    }

    // Set up listener to save auth state changes to localStorage
    pb.authStore.onChange((token, model) => {
        if (token && model) {
            localStorage.setItem('pocketbase_auth', JSON.stringify({ token, model }));
        } else {
            localStorage.removeItem('pocketbase_auth');
        }
    });
}

export default pb;
