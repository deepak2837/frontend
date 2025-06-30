// app/api/question-bank/[id]/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request, { params }) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { searchParams } = new URL(request.url);

  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 5;
  const difficulty = searchParams.get("difficulty") || "";
  const subject = searchParams.get("subject") || "";

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/question-bank/questions-full/${id}?page=${page}&limit=${limit}&difficulty=${difficulty}&subject=${subject}`,
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
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching question bank data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
