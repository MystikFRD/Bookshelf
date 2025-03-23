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
import ProfilePage from "./Pages/Profile/ProfilePage.jsx";
import ProtectedRoute from "./Components/ProtectedRoute";
import UpdateReadingProgress from "./Pages/ReadingList/UpdateReadingProgress";

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
            // User routes
            {
                path: '/profile',
                element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
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