"use client";
import React, { useState, useEffect, useRef } from 'react';
import collegeData from '@/lib/mbbs_college_list.json';

const CollegeSearchDropdown = ({ value, onChange, placeholder = "Search for college..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [isCustomInput, setIsCustomInput] = useState(false);
  const dropdownRef = useRef(null);

  // Extract unique college names from the data
  const collegeNames = [...new Set(collegeData.map(college => college.collegeName))].sort();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredColleges(collegeNames.slice(0, 10)); // Show first 10 colleges when empty
    } else {
      const filtered = collegeNames
        .filter(college => 
          college.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 10); // Limit to 10 results
      setFilteredColleges(filtered);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Check if current value is in the college list
    if (value && !collegeNames.includes(value)) {
      setIsCustomInput(true);
      setSearchTerm(value);
    } else if (value) {
      setIsCustomInput(false);
      setSearchTerm(value);
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    setIsCustomInput(true);
    
    // Update parent component
    onChange(newValue);
  };

  const handleCollegeSelect = (collegeName) => {
    setSearchTerm(collegeName);
    setIsCustomInput(false);
    setIsOpen(false);
    onChange(collegeName);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Small delay to allow click on dropdown items
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
        autoComplete="off"
      />
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredColleges.length > 0 ? (
            <>
              {filteredColleges.map((college, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleCollegeSelect(college)}
                >
                  {college}
                </div>
              ))}
              {searchTerm && !filteredColleges.includes(searchTerm) && (
                <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200">
                  Press Enter to use: "{searchTerm}"
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No colleges found. You can enter a custom college name.
            </div>
          )}
        </div>
      )}
      
      {isCustomInput && searchTerm && (
        <div className="mt-1 text-xs text-gray-500">
          Custom college name entered
        </div>
      )}
    </div>
  );
};

export default CollegeSearchDropdown; 