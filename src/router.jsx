import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from './Pages/Home/Home';
import Books from "./Pages/Browsebook/Books";
import AddBooks from "./Pages/Addbooks/AddBooks";
import BookDetail from "./Pages/Bookdetail/BookDetail";
import Error from "./Pages/Error/Error";
import BookPage from "./Components/BookPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Error />, // Fehlerseite für ungültige Routen
        children: [
            {
                path: '/',
                element: <Home /> // Startseite
            },
            {
                path: '/browsebook',
                element: <Books /> // Seite zum Durchsuchen von Büchern
            },
            {
                path: '/addbooks',
                element: <AddBooks /> // Seite zum Hinzufügen von Büchern
            },
            {
                path: '/book/:id',
                element: <BookDetail /> // Detailseite für ein Buch
            },
            {
                path: '/books/:category', // Korrigierter Pfad (category statt catergory)
                element: <BookPage /> // Seite für Bücher basierend auf einer Kategorie
            }
        ]
    }
]);

export default router;
