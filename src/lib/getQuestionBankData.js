import { requireAuth } from "@/utils/auth";

export async function getQuestionBankData(id, page = 1, filters = {}) {
  const token = requireAuth();

  if (!token) {
    return {
      questions: [],
      pagination: { totalPages: 0, currentPage: 1 },
      error: "Unauthorized",
    };
  }

  try {
    const queryParams = new URLSearchParams({
      page,
      limit: 5,
      ...filters,
    }).toString();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/question-bank/questions-full/${id}?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      pagination: { totalPages: 0, currentPage: page },
      error: error.message,
    };
  }
}
