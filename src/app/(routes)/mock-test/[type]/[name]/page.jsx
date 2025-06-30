// app/mock-test/[type]/[name]/page.jsx
import { Suspense } from "react";
import MedicalExamContent from "./MedicalExamContent";
import { fetchWithAuth } from "@/utils/auth";
import { redirect } from "next/navigation";
// This enables dynamic behavior at request time
export const dynamic = "force-dynamic";
// This is the main server component that will fetch data
export default async function MedicalExamPage({ params }) {
  const { type, name } = params;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const queryParams = new URLSearchParams({
    testType: type || "",
    examName: name || "",
  });
  // Use our server auth utility to fetch data
  const { data, error, status } = await fetchWithAuth(
    `${BASE_URL}/api/v1/mock-test/live-tests?${queryParams}`
  );
  // Redirect to login page if unauthorized
  if (status === 401) {
    redirect("/login");
  }
  // Initialize tests and error to be passed to client component
  const initialTests = data?.success ? data.data || [] : [];
  const initialError = error || (data?.success ? null : data?.message);
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-slate-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500" />
        </div>
      }
    >
      <MedicalExamContent
        initialTests={initialTests}
        initialError={initialError}
        testType={type}
        examName={name}
        isLoading={false}
      />
    </Suspense>
  );
}
