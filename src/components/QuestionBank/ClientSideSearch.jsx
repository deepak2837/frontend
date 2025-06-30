"use client";

import { useState } from "react";

export default function ClientSideSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // You could emit an event or use a context to communicate with other components
    window.dispatchEvent(
      new CustomEvent('questionBankSearch', { detail: e.target.value })
    );
  };

  return (
    <div className="relative max-w-lg">
      <input
        type="text"
        placeholder="Search for question banks..."
        className="w-full py-2 px-4 pl-10 rounded-lg text-gray-800 text-sm shadow-lg focus:ring-2 focus:ring-white/30 focus:outline-none"
        value={searchTerm}
        onChange={handleSearch}
      />
      <svg
        className="w-4 h-4 text-gray-500 absolute left-3 top-2.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
    </div>
  );
}