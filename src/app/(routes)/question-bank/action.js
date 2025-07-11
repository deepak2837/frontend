// app/question-bank/actions.js
"use server";

import { requireAuth } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const REQUIRE_QUESTION_BANK_AUTH = process.env.NEXT_PUBLIC_QUESTION_BANK_AUTHENTICATION === "true";

export async function fetchQuestionBankData(id, page = 1, filters = {}) {
  // Token logic: SSR-style
  async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value;
  }

  let token = null;
  if (REQUIRE_QUESTION_BANK_AUTH) {
    token = await requireAuth();
    if (!token) {
      redirect("/login");
    }
  } else {
    token = await getAuthToken();
  }

  try {
    const queryParams = new URLSearchParams({
      page,
      limit: 5,
      ...filters,
    }).toString();

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await fetch(
      `${BASE_URL}/api/v1/question-bank/questions-full/${id}?${queryParams}`,
      {
        headers,
        cache: "no-store", // Don't cache this data
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Error fetching question bank data:", error);
    return {
      success: false,
      error: error.message,
      data: {
        questions: [],
        pagination: { totalPages: 0, currentPage: page },
      },
    };
  }
}

export async function recordAttempt(formData) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/user-activities/record-attempt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: formData.get("userId"),
          questionBankId: formData.get("questionBankId"),
          questionId: formData.get("questionId"),
          isCorrect: formData.get("isCorrect") === "true",
          timeSpent: parseInt(formData.get("timeSpent") || "0"),
          hintsUsed: parseInt(formData.get("hintsUsed") || "0"),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error recording attempt:", error);
    return { success: false, error: error.message };
  }
}
