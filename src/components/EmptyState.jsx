// app/components/EmptyState.jsx

import React from "react";

export default function EmptyState({
  icon = "default",
  title = "No items found",
  message = "There are no items available to display.",
  className = "",
}) {
  // Icon variants
  const iconVariants = {
    default: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 sm:h-14 sm:w-14 lg:h-20 lg:w-20 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    search: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 sm:h-14 sm:w-14 lg:h-20 lg:w-20 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    document: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 sm:h-14 sm:w-14 lg:h-20 lg:w-20 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 sm:h-14 sm:w-14 lg:h-20 lg:w-20 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    calendar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 sm:h-14 sm:w-14 lg:h-20 lg:w-20 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    question: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 sm:h-14 sm:w-14 lg:h-20 lg:w-20 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  // Render the selected icon or default if not found
  const renderIcon = () => {
    if (typeof icon === "string") {
      return iconVariants[icon] || iconVariants.default;
    }
    // If icon is passed as a React component
    return icon;
  };

  return (
    <div
      className={`text-center p-5 sm:p-8 lg:p-12 bg-gray-50 rounded-xl shadow border ${className}`}
    >
      {renderIcon()}
      <h3 className="text-base sm:text-lg lg:text-2xl font-semibold text-gray-700 mt-3 lg:mt-5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-1 lg:mt-2">
        {message}
      </p>
    </div>
  );
}
