// app/api/tests/route.js
import { NextResponse } from "next/server";
import { getAuthToken } from "@/utils/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request) {
  const token = getAuthToken();

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get query params from the request URL
  const { searchParams } = new URL(request.url);
  const testType = searchParams.get("testType");
  const examName = searchParams.get("examName");

  const queryParams = new URLSearchParams();
  if (testType) queryParams.append("testType", testType);
  if (examName) queryParams.append("examName", examName);

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/mock-test/live-tests?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: errorData?.message || "Failed to fetch tests",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
