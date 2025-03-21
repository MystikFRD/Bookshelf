import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className="font-Poppins text-center p-10">
            <h2 className="text-8xl font-semibold text-red-500">404</h2>
            <p className="text-5xl font-medium mt-4">Page Not Found</p>
            <p className="font-light text-xl mt-2">The page you are looking for does not exist or the route is incorrect.</p>
            <div className="mt-10">
                <Link to="/">
                    <button className="bg-blue-50 border-2 border-blue-200 text-black font-normal px-5 py-2 rounded-3xl hover:bg-blue-100">
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Error;
