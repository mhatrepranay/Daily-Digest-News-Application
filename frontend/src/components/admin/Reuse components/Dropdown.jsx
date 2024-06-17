// Dropdown.js
import React from 'react';
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";

const DropdownMenu = ({ dropdownVisible, toggleDropdown, handleSortByDate, handleSortOrderAsc, handleSortOrderDesc, sortBy, sortOrder, handleSortByPopularity }) => {
    const dropdownStyle = {
        position: 'absolute',
        top: 'calc(100% - 70px)',
        zIndex: 1000,
        backgroundColor: '#gray',
        minWidth: '160px',
        boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
        borderRadius: '4px',
        display: dropdownVisible ? 'block' : 'none',
    };

    return (
        <div className="dropdown-content" style={dropdownStyle}>
            <a onClick={handleSortByDate}>
                All
            </a>
            <div className="cursor-pointer flex items-center">
                <span className='mr-4'>Date</span>
                {sortBy === 'date' && (
                    <>
                        {sortOrder === 'asc' ? (
                            <FaArrowUpLong onClick={handleSortOrderDesc} />
                        ) : (
                            <FaArrowDownLong onClick={handleSortOrderAsc} />
                        )}
                    </>
                )}
            </div>
            <div className="cursor-pointer flex items-center" onClick={handleSortByPopularity}>
                <span className='mr-4'>Popularity</span>
            </div>
        </div>
    );
};

export default DropdownMenu;
