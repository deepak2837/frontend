// app/question-bank/[type]/[bankId]/page.jsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import BankCard from "./BankCard";
import EmptyState from "@/components/EmptyState";
import { requireAuth } from "@/utils/auth";
import { API_URL } from "@/config/config";

// Fetch questions from your API
async function getQuestions(token) {
  try {
    const response = await fetch(`${API_URL}/api/v1/question-bank/list/live`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensures fresh data on each request
    });

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return { data: [] };
  }
}

export default async function QuestionBanksPage({ params }) {
  // Get authentication token from cookies
  const token = requireAuth();

  // Check authentication
  if (!token) {
    redirect("/login");
  }

  // Decode params safely
  const bankIdParam = params.bankId ? decodeURIComponent(params.bankId) : "";
  const typeParam = params.type ? decodeURIComponent(params.type) : "";

  // Fetch data server-side
  const response = await getQuestions(token);

  // Filter banks based on bankIdParam
  const filteredBanks =
    response?.data?.filter(
      (bank) =>
        bank.name &&
        bankIdParam &&
        bank.name.toLowerCase() === bankIdParam.toLowerCase()
    ) || [];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 lg:py-8">
      {/* Header - Bigger on desktop */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 lg:mb-10 gap-2 sm:gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
            {typeParam.charAt(0).toUpperCase() + typeParam.slice(1)} Question
            Banks
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-1 lg:mt-2">
            Browse and explore question banks for {bankIdParam}
          </p>
        </div>
        <Link href="/question-bank">
          <button className="bg-primary hover:bg-primary/90 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-lg font-medium flex items-center gap-1.5 transition shadow-md hover:shadow-lg text-xs sm:text-sm lg:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Categories
          </button>
        </Link>
      </div>

      {/* Content Area: Responsive Grid or Empty State */}
      {filteredBanks.length === 0 ? (
        <EmptyState
          icon="question"
          title="No question banks found"
          message="There are no question banks available for this category."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredBanks.map((bank) => (
            <BankCard key={bank._id} bank={bank} typeParam={typeParam} />
          ))}
        </div>
      )}
    </div>
  );
}
