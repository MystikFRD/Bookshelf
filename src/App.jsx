import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Components/Navbar";
import Footer from './Components/Footer';
import { useEffect } from "react";

function App() {
    const isDark = useSelector((state) => state.darkMode.isDark);

    // Update the document's class based on dark mode state
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <Navbar />
            <div className="min-h-screen pb-10">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default App;