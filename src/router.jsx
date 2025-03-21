// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from './Pages/Home/Home';
import Books from "./Pages/Browsebook/Books";
import AddBooks from "./Pages/Addbooks/AddBooks";
import BookDetail from "./Pages/Bookdetail/BookDetail";
import Error from "./Pages/Error/Error";
import BookPage from "./Components/BookPage";
import ErrorBoundary from "./Components/ErrorBoundary"; // Import the ErrorBoundary

const router = createBrowserRouter([
    {
        path:'/',
        element: <ErrorBoundary><App /></ErrorBoundary>,
        children:[
            {
                path:'/',
                element: <ErrorBoundary><Home /></ErrorBoundary>
            },
            {
                path:'/browsebook',
                element: <ErrorBoundary><Books /></ErrorBoundary>
            },{
                path:'/addbooks',
                element: <ErrorBoundary><AddBooks /></ErrorBoundary>
            },{
                path:'/book/:id',
                element: <ErrorBoundary><BookDetail /></ErrorBoundary>
            },{
                path:'/books/:catergory',
                element: <ErrorBoundary><BookPage /></ErrorBoundary>
            }
        ],
        errorElement: <Error />
    },
]);

export default router;