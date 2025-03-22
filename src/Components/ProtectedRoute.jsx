import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.user);
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        // Save the current location to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render children if authenticated
    return children;
};

export default ProtectedRoute;

// 3. Update Router Configuration to use Protected Routes
// Modify: src/router.jsx

import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from './Pages/Home/Home';
import Books from "./Pages/Browsebook/Books";
import AddBooks from "./Pages/Addbooks/AddBooks";
import BookDetail from "./Pages/Bookdetail/BookDetail";
import Error from "./Pages/Error/Error";
import BookPage from "./Components/BookPage";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ReadingList from "./Pages/ReadingList/ReadingList.jsx";
import ProtectedRoute from "./Components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Error />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/browsebook',
                element: <Books />
            },
            {
                path: '/addbooks',
                element: <ProtectedRoute><AddBooks /></ProtectedRoute>
            },
            {
                path: '/book/:id',
                element: <BookDetail />
            },
            {
                path: '/books/:category',
                element: <BookPage />
            },
            // Auth routes
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/reading-list',
                element: <ProtectedRoute><ReadingList /></ProtectedRoute>
            },
            {
                path: '/update-progress/:id',
                element: <ProtectedRoute><UpdateReadingProgress /></ProtectedRoute>
            }
        ]
    }
]);

export default router;
