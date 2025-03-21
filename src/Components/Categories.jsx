import React from "react";
import Tabbutton from "./Tabbutton";

const Categories = () => {
    return (
        <div className="py-8">
            <h2 className="text-3xl font-bold text-center mb-6">Categories</h2>
            <div className="flex flex-wrap justify-center gap-3">
                <Tabbutton to='/books/science'>Science</Tabbutton>
                <Tabbutton to='/books/fiction'>Fiction</Tabbutton>
                <Tabbutton to='/books/non_fiction'>Non-Fiction</Tabbutton>
                <Tabbutton to='/books/fantacy'>Fantasy</Tabbutton>
                <Tabbutton to='/books/crime'>Crime</Tabbutton>
            </div>
        </div>
    );
};

export default Categories;