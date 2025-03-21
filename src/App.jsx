import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from './Components/Footer';

function App() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <Outlet /> {/* Hier werden die Seiteninhalte dynamisch gerendert */}
            </div>
            <Footer />
        </>
    );
}

export default App;
