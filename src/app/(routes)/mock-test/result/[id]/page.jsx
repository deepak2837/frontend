// app/mock-test/result/[id]/page.js
import { getMockTestResult } from "@/lib/api/mock-test"; // You'll need to create this API function
import { redirect } from "next/navigation";
import ResultDisplay from "@/components/ResultDisplay";
import { getAuthToken } from "@/utils/auth";
import { NotFound } from "./error";

export const dynamic = "force-dynamic"; // Make sure this page is not statically generated

export async function generateMetadata({ params }) {
  const { id } = params;
  // You can fetch minimal data here just for metadata if needed
  return {
    title: `Mock Test Result #${id} | Medical Examination`,
    description:
      "View your detailed mock test results and performance analysis",
  };
}

export default async function ResultPage({ params }) {
  const { id } = params;

  // Check authentication
  const session = getAuthToken();
  console.log("SESSION", session);
  if (!session) {
    redirect("/login");
  }

  // Fetch result data server-side
  try {
    const result = await getMockTestResult(id, session);

    console.log("result", result);

    if (!result) {
      NotFound();
    }

    return (
      <div className="bg-gray-50 min-h-screen pb-16 px-4 pt-6">
        <ResultDisplay result={result.data || result} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching test result:", error);
    // You can handle specific error cases here
    throw new Error("Failed to load test result");
  }
}
