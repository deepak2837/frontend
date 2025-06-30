// app/mock-tests/page.jsx
import { cookies } from "next/headers";
import MockTestsClient from "./MockTestClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// This is the server component
export default async function MockTests() {
  // Get auth token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  let testsData = [];
  let error = null;

  try {
    // Fetch data on the server
    const response = await fetch(`${BASE_URL}/api/v1/mock-test/live-tests`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      // Next.js cache options
      cache: "no-store", // Don't cache this request
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.data) {
      testsData = data.data;
    } else {
      throw new Error(data.message || "Failed to retrieve valid test data.");
    }
  } catch (err) {
    console.error("Fetch Tests Error:", err);
    error = err.message || "Failed to fetch tests. Please try again.";
  }

  return <MockTestsClient initialTests={testsData} initialError={error} />;
}
