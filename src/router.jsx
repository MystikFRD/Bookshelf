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
                element: <AddBooks />
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
                element: <ReadingList />
            }
        ]
    }
]);

export default router;