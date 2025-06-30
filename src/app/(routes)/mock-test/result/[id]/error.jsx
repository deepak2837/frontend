// app/mock-test/result/[id]/error.js
"use client";

import { useEffect } from "react";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Result page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="text-red-500 mb-4">
          <XCircle size={48} className="mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Error Loading Results
        </h2>
        <p className="text-gray-600 mb-6">
          We could not load your test results. Please try again or contact
          support.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => reset()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/mock-test")}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Return to Mock Tests
          </button>
        </div>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="text-yellow-500 mb-4">
          <HelpCircle size={48} className="mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          No Results Found
        </h2>
        <p className="text-gray-600 mb-6">
          We could not find any results for this test. The test may not exist or
          has been removed.
        </p>
        <Link
          href="/mock-test"
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Browse Available Tests
        </Link>
      </div>
    </div>
  );
}

// app/mock-test/result/[id]/loading.js
export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading your results...</p>
      </div>
    </div>
  );
}
