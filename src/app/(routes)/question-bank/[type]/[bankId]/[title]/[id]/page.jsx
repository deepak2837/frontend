// app/question-bank/[id]/page.js
import { Suspense } from "react";

import { redirect } from "next/navigation";
import LineLoader from "@/components/common/Loader";
import QuestionBankClientPage from "./client-page";
import { requireAuth } from "@/utils/auth";
const REQUIRE_QUESTION_BANK_AUTH = process.env.NEXT_PUBLIC_QUESTION_BANK_AUTHENTICATION === "true";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Server component that fetches data
async function fetchInitialData(id) {
  let token = null;
  if (REQUIRE_QUESTION_BANK_AUTH) {
    token = requireAuth();
    if (!token) {
      redirect("/login");
    }
  }

  const headers = REQUIRE_QUESTION_BANK_AUTH && token
    ? { Authorization: `Bearer ${token}` }
    : {};

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/question-bank/questions-full/${id}?page=1&limit=5`,
      {
        headers,
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching question bank data:", error);
    return {
      questions: [],
      pagination: { totalPages: 0, currentPage: 1 },
    };
  }
}

export default async function QuestionBankPage({ params }) {
  const initialData = await fetchInitialData(params.id);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LineLoader />
        </div>
      }
    >
      <QuestionBankClientPage
        id={params.id}
        initialQuestions={initialData.questions || []}
        initialTotalPages={initialData.pagination?.totalPages || 0}
      />
    </Suspense>
  );
}

// This enables the page to be statically generated at build time
// with the provided paths, but also allows for on-demand rendering
export const dynamicParams = true;
