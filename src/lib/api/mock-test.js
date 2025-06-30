// lib/api/mock-test.js
import { API_URL } from "@/config/config";
import { revalidatePath } from "next/cache";

/**
 * Fetches mock test result data from the API
 * @param {string} id - The ID of the mock test result
 * @param {string} token - Auth token for API request
 * @returns {Promise<Object>} - The mock test result data
 *
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export async function getMockTestResult(id, token) {
  if (!id || !token) {
    throw new Error("Missing required parameters");
  }

  console.log("ID, token", id, token);

  try {
    // Replace with your actual API endpoint
    const response = await fetch(`${BASE_URL}/api/v1/results/test/${id}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Don't cache this data
    });

    console.log("RESPONSE", response);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Return null for 404 to show not found page
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching mock test result:", error);
    throw error;
  }
}

/**
 * Revalidate the result page to update cache when data changes
 * @param {string} id - The ID of the mock test result
 */
export function revalidateTestResult(id) {
  revalidatePath(`/mock-test/result/${id}`);
}
