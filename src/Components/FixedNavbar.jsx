// src/Components/FixedNavbar.jsx
import React from 'react';
// Import only the essential dependencies first
// Don't import any custom hooks or components yet

const FixedNavbar = () => {
    return (
        <nav className="w-full">
            <div className="bg-white font-Poppins flex justify-between items-center p-5">
                <h2 className="font-Oswald font-base text-2xl text-black">eBook</h2>
                <div>
                    {/* Simplified navigation - no Router links yet */}
                    <ul className="hidden md:flex items-center gap-5 text-medium font-base">
                        <li>Home</li>
                        <li>Browse Book</li>
                        <li>Add books</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default FixedNavbar;