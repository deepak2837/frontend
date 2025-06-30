// Next.js server component
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LineLoader from "@/components/common/Loader";
import subjectImage from "../../../../public/subjects.png";
import examsImage from "../../../../public/exams.png";
import coursesImage from "../../../../public/courses.png";
import ClientSideSearch from "@/components/QuestionBank/ClientSideSearch";
import QuestionBankContent from "@/components/QuestionBank/QuestionBankContent";
import { API_URL } from "@/config/config";
import { requireAuth } from "@/utils/auth";

// Category icons for visual enhancement
const categoryIcons = {
  exam: examsImage,
  subject: subjectImage,
  course: coursesImage,
};

// Enhanced colors for difficulty tags with proper contrast
const difficultyColors = {
  easy: "bg-green-100 text-green-800 ring-1 ring-green-200",
  medium: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
  hard: "bg-red-100 text-red-800 ring-1 ring-red-200",
};

// Server function to fetch questions
async function getQuestions(token) {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`${API_URL}/api/v1/question-bank/list/live`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Enable next.js cache - adjust based on your needs
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return { error: true };
  }
}

export default async function Page() {
  // Get authentication token from cookies
  const token = requireAuth();

  // Check if user is authenticated
  if (!token) {
    redirect("/login");
  }

  // Fetch data server-side
  const response = await getQuestions(token);
  const isError = response.error;
  const data = response.data;

  // Error state with better visual feedback
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
        <div className="bg-red-50 p-6 rounded-xl shadow-md max-w-md w-full text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118-0z"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Unable to Load Question Banks
          </h2>
          <p className="text-gray-600 mb-4">
            We encountered an error while fetching data. Please try again later.
          </p>
          <form action="/" method="get">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Try Again
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9.01 9.01 0 01.128 1.5A8.98 8.98 0 005 12a9 9 0 0113.8 1.6"
            ></path>
          </svg>
          <div className="text-gray-600 text-xl font-medium mb-2">
            No question banks found
          </div>
          <p className="text-gray-500">
            Please check back later for new content.
          </p>
        </div>
      </div>
    );
  }

  // Group data by type
  const groupedByType = data.reduce((acc, bank) => {
    if (!acc[bank.type]) {
      acc[bank.type] = {};
    }

    if (!acc[bank.type][bank.name]) {
      acc[bank.type][bank.name] = [];
    }
    acc[bank.type][bank.name].push(bank);

    return acc;
  }, {});

  const allCategories = Object.keys(groupedByType);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section - More compact */}
        <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-xl md:rounded-2xl mb-6 md:mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative p-5 md:p-8 lg:p-12 text-white">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-2 md:mb-3 leading-tight">
              Find the Perfect
              <br />
              Question Bank
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-2xl mb-4 md:mb-6">
              Access comprehensive collections to enhance your preparation
            </p>

            {/* Client-side search component */}
            <ClientSideSearch />
          </div>

          <div className="absolute right-0 bottom-0 hidden lg:block">
            <svg
              width="200"
              height="120"
              viewBox="0 0 300 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="250"
                cy="150"
                r="120"
                fill="white"
                fillOpacity="0.1"
              />
              <circle cx="220" cy="120" r="80" fill="white" fillOpacity="0.1" />
            </svg>
          </div>
        </div>

        {/* Content is rendered by a client component that handles the tab/filtering/search functionality */}
        <QuestionBankContent
          groupedByType={groupedByType}
          categoryIcons={categoryIcons}
          difficultyColors={difficultyColors}
        />
      </div>
    </div>
  );
}
