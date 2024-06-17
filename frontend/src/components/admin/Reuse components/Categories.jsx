// Categories.js
import React from 'react';

const Categories = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <div className="flex mb-1">
            {categories.map(category => (
                <div
                    key={category}
                    className={`p-2 rounded mr-5 transition-all duration-300 ease-in-out ${selectedCategory === category ? 'bg-gray-400 text-white transform scale-105' : 'text-black hover:bg-gray-300'}`}
                    onClick={() => setSelectedCategory(category)}
                >
                    {category}
                </div>
            ))}
        </div>
    );
};

export default Categories;
