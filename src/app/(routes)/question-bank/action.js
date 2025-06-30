// app/question-bank/actions.js
"use server";

import { requireAuth } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchQuestionBankData(id, page = 1, filters = {}) {
  const token = requireAuth();

  if (!token) {
    redirect("/login");
  }

  try {
    const queryParams = new URLSearchParams({
      page,
      limit: 5,
      ...filters,
    }).toString();

    const response = await fetch(
      `${BASE_URL}/api/v1/question-bank/questions-full/${id}?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/user-activities/record-attempt`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
