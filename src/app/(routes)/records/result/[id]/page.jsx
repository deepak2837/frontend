"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ResultDisplay from "@/components/Mocktest/ResultDisplay";
import LineLoader from "@/components/common/Loader";
import useAuthStore from "@/store/authStore";
import useGetMockTestResult from "@/hooks/mock-test/useGetMockTestResult";
import {
  ArrowLeft,
  Home,
  Download,
  Share2,
  BookOpen,
  CheckCircle,
  XCircle,
  BarChart2,
  Clock,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { getToken, user } = useAuthStore();
  const token = getToken();
  const { data: result, isLoading, isError } = useGetMockTestResult(id);
  const [activeTab, setActiveTab] = useState("summary");

  // Color scheme
  const pinkColor = "#FE6B8B";
  const orangeColor = "#FF8E53";
  const lightPinkBorder = "#FED7DD";
  const lightPinkBg = "#FFF0F3";
  const lightOrangeBg = "#FFF4EC";

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const handleDownloadPDF = () => {
    // PDF download functionality would be implemented here
    alert("Downloading PDF...");
  };

  const handleShareResult = () => {
    // Share functionality would be implemented here
    navigator.clipboard.writeText(window.location.href);
    alert("Result URL copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <LineLoader />
        <p className="mt-4 text-gray-600">Loading your test results...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-600 text-xl mb-4">
            Unable to load results
          </div>
          <p className="text-gray-600 mb-6">
            We encountered an error while retrieving your test results. Please
            try again later.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
              style={{ backgroundColor: pinkColor }}
            >
              <ArrowLeft size={16} className="mr-2" /> Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-gray-800 text-xl mb-4">No Results Found</div>
          <p className="text-gray-600 mb-6">
            We could not find the test results you are looking for. It may have
            been deleted or the ID is incorrect.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
            style={{ backgroundColor: pinkColor }}
          >
            <ArrowLeft size={16} className="mr-2" /> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const testData = result.data;
  const {
    totalQuestions = 0,
    attemptedQuestions = 0,
    correctAnswers = 0,
    incorrectAnswers = 0,
    score = 0,
    percentage = 0,
    passed = false,
    rank = "N/A",
    incorrectAnswersDetails = [],
    subjectWiseAnalysis = [],
    benchmarking = {},
  } = testData || {};

  // Format date from ISO string
  const completedDate = new Date(
    testData?.createdAt || Date.now()
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate statistics for display
  const skippedAnswers = totalQuestions - attemptedQuestions;
  const accuracyRate =
    attemptedQuestions > 0
      ? Math.round((correctAnswers / attemptedQuestions) * 100)
      : 0;

  // Get passing threshold (arbitrary since it's not in the data)
  const passThreshold = 50; // Example value, replace with actual if available

  // Header style with gradient
  const headerStyle = {
    background: `linear-gradient(45deg, ${pinkColor} 0%, ${orangeColor} 100%)`,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Navigation Bar */}
      <div className="bg-white shadow-md top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-bold text-gray-800">
                Test Result Analysis
              </h2>
              <p className="text-sm text-gray-500">
                Completed on {completedDate}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => router.back()}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center text-sm"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center text-sm"
              >
                <Download size={16} className="mr-1" /> Save PDF
              </button>
              <button
                onClick={handleShareResult}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center text-sm"
              >
                <Share2 size={16} className="mr-1" /> Share
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-3 py-2 text-white rounded hover:opacity-90 transition-colors flex items-center text-sm"
                style={{ backgroundColor: pinkColor }}
              >
                <Home size={16} className="mr-1" /> Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary Card */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Result: {passed ? "Passed" : "Not Passed"}
              </h2>
              <p className="text-gray-600">
                {passed
                  ? "Congratulations! You've successfully passed this medical mock test."
                  : "Keep practicing! Focus on the areas highlighted in your results to improve."}
              </p>
              <div className="mt-2">
                <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded inline-flex items-center">
                  <Award size={14} className="mr-1" /> Rank: {rank}
                </span>
                {benchmarking?.yourPercentile !== undefined && (
                  <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded ml-2 inline-flex items-center">
                    <BarChart2 size={14} className="mr-1" /> Percentile:{" "}
                    {Math.round(benchmarking.yourPercentile)}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="w-32 h-32 rounded-full border-8 flex items-center justify-center bg-white"
                style={{
                  borderColor:
                    percentage >= passThreshold ? lightPinkBg : "#FEE2E2",
                }}
              >
                <div className="text-center">
                  <div
                    className="text-3xl font-bold"
                    style={{
                      color:
                        percentage >= passThreshold ? pinkColor : "#DC2626",
                    }}
                  >
                    {Math.round(percentage)}%
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
              </div>
              <div className="ml-6 text-center md:text-left">
                <div className="text-xl font-semibold">
                  {correctAnswers} / {totalQuestions}
                </div>
                <div className="text-sm text-gray-500">Questions Correct</div>
                <div
                  className="mt-2 px-3 py-1 text-sm rounded-full inline-flex items-center"
                  style={{
                    backgroundColor: passed ? lightPinkBg : "#FEE2E2",
                    color: passed ? pinkColor : "#DC2626",
                  }}
                >
                  {passed ? (
                    <CheckCircle size={16} className="mr-1" />
                  ) : (
                    <XCircle size={16} className="mr-1" />
                  )}
                  {passed ? "Passed" : "Failed"} (Pass mark: {passThreshold}%)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: lightPinkBg }}
              >
                <CheckCircle size={20} style={{ color: pinkColor }} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Correct Answers</p>
                <h3 className="text-xl font-bold text-gray-800">
                  {correctAnswers}
                </h3>
                <p className="text-xs text-gray-500">
                  {Math.round((correctAnswers / totalQuestions) * 100)}% of
                  total
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100">
                <XCircle size={20} className="text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Incorrect Answers</p>
                <h3 className="text-xl font-bold text-gray-800">
                  {incorrectAnswers}
                </h3>
                <p className="text-xs text-gray-500">
                  {Math.round((incorrectAnswers / totalQuestions) * 100)}% of
                  total
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: lightOrangeBg }}
              >
                <Target size={20} style={{ color: orangeColor }} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Accuracy Rate</p>
                <h3 className="text-xl font-bold text-gray-800">
                  {accuracyRate}%
                </h3>
                <p className="text-xs text-gray-500">of attempted questions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100">
                <TrendingUp size={20} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Target Score</p>
                <h3 className="text-xl font-bold text-gray-800">
                  {benchmarking?.targetScore
                    ? Math.round(benchmarking.targetScore)
                    : "N/A"}
                  %
                </h3>
                <p className="text-xs text-gray-500">to reach top performers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
                activeTab === "summary"
                  ? "border-b-2 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={{
                borderColor:
                  activeTab === "summary" ? pinkColor : "transparent",
                color: activeTab === "summary" ? pinkColor : "",
              }}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("subjects")}
              className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
                activeTab === "subjects"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={{
                borderColor:
                  activeTab === "subjects" ? pinkColor : "transparent",
                color: activeTab === "subjects" ? pinkColor : "",
              }}
            >
              Subject Analysis
            </button>
            <button
              onClick={() => setActiveTab("wrong")}
              className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
                activeTab === "wrong"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={{
                borderColor: activeTab === "wrong" ? pinkColor : "transparent",
                color: activeTab === "wrong" ? pinkColor : "",
              }}
            >
              Incorrect Answers
            </button>
            <button
              onClick={() => setActiveTab("benchmarking")}
              className={`px-6 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${
                activeTab === "benchmarking"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={{
                borderColor:
                  activeTab === "benchmarking" ? pinkColor : "transparent",
                color: activeTab === "benchmarking" ? pinkColor : "",
              }}
            >
              Benchmarking
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "summary" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Test Summary</h2>
              <p className="mb-4">
                This report provides a comprehensive breakdown of your
                performance on this Medical Mock Test. Review your results
                carefully to identify areas for improvement in your medical
                knowledge.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Test Statistics
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total Questions:</span>
                      <span className="font-medium">{totalQuestions}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">
                        Attempted Questions:
                      </span>
                      <span className="font-medium">{attemptedQuestions}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Skipped Questions:</span>
                      <span className="font-medium">{skippedAnswers}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Pass Status:</span>
                      <span
                        className="font-medium"
                        style={{ color: passed ? pinkColor : "#DC2626" }}
                      >
                        {passed ? "Passed" : "Not Passed"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Performance Metrics
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Your Score:</span>
                      <span className="font-medium">
                        {Math.round(percentage)}%
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Accuracy Rate:</span>
                      <span className="font-medium">{accuracyRate}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Your Rank:</span>
                      <span className="font-medium">{rank}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Percentile:</span>
                      <span className="font-medium">
                        {benchmarking?.yourPercentile !== undefined
                          ? Math.round(benchmarking.yourPercentile)
                          : "N/A"}
                        %
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Subject Performance Overview
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Subject
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Questions
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Correct
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Accuracy
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subjectWiseAnalysis?.map((subject) => (
                        <tr key={subject?._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {subject?.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {subject?.totalQuestions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {subject?.correct}/{subject?.attempted}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="mr-2 text-sm text-gray-900">
                                {subject?.accuracy}%
                              </div>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${subject?.accuracy || 0}%`,
                                    backgroundColor:
                                      subject?.accuracy >= 70
                                        ? pinkColor
                                        : subject?.accuracy >= 40
                                        ? orangeColor
                                        : "#DC2626",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )) || []}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setActiveTab("wrong")}
                  className="px-4 py-2 text-white rounded hover:opacity-90 transition-colors"
                  style={{ backgroundColor: pinkColor }}
                >
                  Review Incorrect Answers
                </button>
                <button
                  onClick={() => router.push("/practice")}
                  className="px-4 py-2 text-white rounded hover:opacity-90 transition-colors"
                  style={{ backgroundColor: orangeColor }}
                >
                  Practice More Tests
                </button>
              </div>
            </div>
          )}

          {activeTab === "subjects" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Subject-wise Analysis</h2>
              <p className="mb-6">
                Detailed breakdown of your performance across different medical
                subjects. Focus on subjects with lower accuracy scores.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {subjectWiseAnalysis?.map((subject) => (
                  <div
                    key={subject?._id}
                    className="bg-white border rounded-lg p-4 shadow-sm"
                    style={{ borderColor: lightPinkBorder }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">
                        {subject?.subject}
                      </h3>
                      <span
                        className="text-sm px-2 py-1 rounded-full"
                        style={{
                          backgroundColor:
                            subject?.accuracy >= 70
                              ? lightPinkBg
                              : subject?.accuracy >= 40
                              ? lightOrangeBg
                              : "#FEE2E2",
                          color:
                            subject?.accuracy >= 70
                              ? pinkColor
                              : subject?.accuracy >= 40
                              ? orangeColor
                              : "#DC2626",
                        }}
                      >
                        {subject?.accuracy}% Accuracy
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Questions:</span>
                        <span>{subject?.totalQuestions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Attempted:</span>
                        <span>{subject?.attempted}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Correct:</span>
                        <span style={{ color: pinkColor }}>
                          {subject?.correct}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Incorrect:</span>
                        <span className="text-red-600">
                          {subject?.incorrect}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width: `${subject?.accuracy || 0}%`,
                            backgroundColor:
                              subject?.accuracy >= 70
                                ? pinkColor
                                : subject?.accuracy >= 40
                                ? orangeColor
                                : "#DC2626",
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium mb-2">
                        Recommendation:
                      </h4>
                      <p className="text-sm text-gray-600">
                        {subject?.accuracy >= 70
                          ? "Great work! Continue regular review to maintain mastery."
                          : subject?.accuracy >= 40
                          ? "Focus on strengthening key concepts in this subject."
                          : "Priority area for improvement. Consider dedicated study time."}
                      </p>
                    </div>
                  </div>
                )) || []}
              </div>

              <div
                className="p-4 rounded"
                style={{
                  backgroundColor: lightPinkBg,
                  borderLeft: `4px solid ${pinkColor}`,
                }}
              >
                <h3 className="font-semibold mb-2" style={{ color: pinkColor }}>
                  Subject Improvement Strategy
                </h3>
                <p className="mb-2" style={{ color: pinkColor }}>
                  Based on your results, we recommend focusing on:
                </p>
                <ul
                  className="list-disc list-inside space-y-1"
                  style={{ color: pinkColor }}
                >
                  {subjectWiseAnalysis
                    ?.filter((subject) => (subject?.accuracy || 0) < 70)
                    .map((subject) => (
                      <li key={`improve-${subject?._id}`}>
                        {subject?.subject} -{" "}
                        {(subject?.accuracy || 0) < 40
                          ? "High priority"
                          : "Medium priority"}
                      </li>
                    )) || []}
                  {(subjectWiseAnalysis?.filter(
                    (subject) => (subject?.accuracy || 0) < 70
                  ).length || 0) === 0 && (
                    <li>
                      All subjects show good performance. Continue regular
                      review.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "wrong" && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                Incorrect Answers Review
              </h2>
              <p className="mb-6">
                Study these questions carefully to understand where you went
                wrong and improve your knowledge.
              </p>

              {(incorrectAnswersDetails?.length || 0) > 0 ? (
                <div className="space-y-6">
                  {incorrectAnswersDetails?.map((question, index) => (
                    <div
                      key={question?._id}
                      className="bg-gray-50 rounded-lg p-4 border"
                      style={{ borderColor: lightPinkBorder }}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium text-lg mb-2">
                          Question {index + 1}
                        </h3>
                        {/* Find subject for this question if possible */}
                        {subjectWiseAnalysis?.map(
                          (subject) =>
                            (subject?.incorrect || 0) > 0 && (
                              <span
                                key={`subject-${subject?._id}`}
                                className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                              >
                                {subject?.subject}
                              </span>
                            )
                        ) || []}
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-800">
                          {question?.questionText}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div
                          className="flex-1 p-3 rounded border"
                          style={{
                            backgroundColor: "#FEE2E2",
                            borderColor: "#FECACA",
                          }}
                        >
                          <p className="text-sm text-gray-600 mb-1">
                            Your Answer:
                          </p>
                          <p className="font-medium text-red-700">
                            Option {question?.userAnswer?.toUpperCase()}
                          </p>
                          <p className="text-sm text-red-700 mt-1">
                            {question?.options?.find(
                              (opt) => opt.key === question?.userAnswer
                            )?.value || "No option text available"}
                          </p>
                        </div>
                        <div
                          className="flex-1 p-3 rounded border"
                          style={{
                            backgroundColor: lightPinkBg,
                            borderColor: lightPinkBorder,
                          }}
                        >
                          <p className="text-sm text-gray-600 mb-1">
                            Correct Answer:
                          </p>
                          <p
                            className="font-medium"
                            style={{ color: pinkColor }}
                          >
                            Option {question?.correctAnswer?.toUpperCase()}
                          </p>
                          <p
                            className="text-sm mt-1"
                            style={{ color: pinkColor }}
                          >
                            {question?.options?.find(
                              (opt) => opt.key === question?.correctAnswer
                            )?.value || "No option text available"}
                          </p>
                        </div>
                      </div>

                      {question?.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <h4 className="font-medium text-blue-800 mb-2">
                            Explanation:
                          </h4>
                          <p className="text-sm text-blue-700">
                            {question?.explanation}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <button
                          className="text-sm inline-flex items-center text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            // Add to study notes functionality would be implemented here
                            alert("Added to study notes!");
                          }}
                        >
                          <BookOpen size={16} className="mr-1" /> Add to Study
                          Notes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No Incorrect Answers!
                  </h3>
                  <p className="text-gray-500">
                    Great job! You answered all questions correctly.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "benchmarking" && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                Performance Benchmarking
              </h2>
              <p className="mb-6">
                See how your performance compares to other test-takers and what
                you need to achieve to reach higher percentiles.
              </p>

              <div
                className="bg-white border rounded-lg p-6 mb-6"
                style={{ borderColor: lightPinkBorder }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Your Performance vs Others
                </h3>

                <div className="mb-6">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100">
                          Percentile Ranking
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full"
                          style={{
                            backgroundColor: lightPinkBg,
                            color: pinkColor,
                          }}
                        >
                          {benchmarking?.yourPercentile !== undefined
                            ? Math.round(benchmarking.yourPercentile)
                            : "N/A"}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{
                          width: `${benchmarking?.yourPercentile || 0}%`,
                          background: `linear-gradient(90deg, ${pinkColor} 0%, ${orangeColor} 100%)`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div
                    className="p-4 border rounded-lg"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <p className="text-sm text-gray-500 mb-1">Average Score</p>
                    <p className="text-xl font-bold">
                      {benchmarking?.averageScore !== undefined
                        ? Math.round(benchmarking.averageScore)
                        : "N/A"}
                      %
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      All test takers
                    </p>
                  </div>

                  <div
                    className="p-4 border rounded-lg"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <p className="text-sm text-gray-500 mb-1">Top 25% Score</p>
                    <p className="text-xl font-bold">
                      {benchmarking?.topQuartileScore !== undefined
                        ? Math.round(benchmarking.topQuartileScore)
                        : "N/A"}
                      %
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      75th percentile
                    </p>
                  </div>

                  <div
                    className="p-4 border rounded-lg"
                    style={{
                      borderColor: lightPinkBorder,
                      backgroundColor: lightPinkBg,
                    }}
                  >
                    <p className="text-sm" style={{ color: pinkColor }}>
                      Your Score
                    </p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: pinkColor }}
                    >
                      {Math.round(percentage)}%
                    </p>
                    <p className="text-xs mt-1" style={{ color: pinkColor }}>
                      {benchmarking?.yourPercentile !== undefined
                        ? `Better than ${Math.round(
                            benchmarking.yourPercentile
                          )}% of test takers`
                        : "No comparison data available"}
                    </p>
                  </div>
                </div>

                {benchmarking?.targetScore !== undefined && (
                  <div
                    className="p-4 border rounded-lg mt-4"
                    style={{ borderColor: lightPinkBorder }}
                  >
                    <div className="flex items-center">
                      <Target
                        size={20}
                        style={{ color: pinkColor }}
                        className="mr-2"
                      />
                      <h4 className="font-medium" style={{ color: pinkColor }}>
                        Target Score for Next Test
                      </h4>
                    </div>
                    <p className="mt-2 text-gray-600">
                      To reach the top 25% of test-takers, aim to score at least{" "}
                      <span className="font-bold" style={{ color: pinkColor }}>
                        {Math.round(benchmarking.targetScore)}%
                      </span>{" "}
                      on your next attempt. This is an improvement of{" "}
                      <span className="font-bold" style={{ color: pinkColor }}>
                        {Math.max(
                          0,
                          Math.round(benchmarking.targetScore - percentage)
                        )}
                        %
                      </span>{" "}
                      from your current score.
                    </p>
                  </div>
                )}
              </div>

              <div
                className="bg-white border rounded-lg p-6"
                style={{ borderColor: lightPinkBorder }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Time Performance Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <Clock size={20} className="text-gray-600 mr-2" />
                      <h4 className="font-medium text-gray-800">
                        Your Timing Metrics
                      </h4>
                    </div>

                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Time Spent:</span>
                        <span className="font-medium">
                          {testData?.timeSpentMinutes || "N/A"} minutes
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">
                          Average Time Per Question:
                        </span>
                        <span className="font-medium">
                          {testData?.avgTimePerQuestion
                            ? testData.avgTimePerQuestion.toFixed(1)
                            : "N/A"}{" "}
                          seconds
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">
                          Average Time - Correct Answers:
                        </span>
                        <span className="font-medium">
                          {testData?.avgTimeCorrectAnswers
                            ? testData.avgTimeCorrectAnswers.toFixed(1)
                            : "N/A"}{" "}
                          seconds
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">
                          Average Time - Incorrect Answers:
                        </span>
                        <span className="font-medium">
                          {testData?.avgTimeIncorrectAnswers
                            ? testData.avgTimeIncorrectAnswers.toFixed(1)
                            : "N/A"}{" "}
                          seconds
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <TrendingUp size={20} className="text-gray-600 mr-2" />
                      <h4 className="font-medium text-gray-800">
                        Benchmark Comparison
                      </h4>
                    </div>

                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">
                          Average Test Time:
                        </span>
                        <span className="font-medium">
                          {benchmarking?.avgTestTime || "N/A"} minutes
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">
                          Top Performers Avg Time:
                        </span>
                        <span className="font-medium">
                          {benchmarking?.topPerformersAvgTime || "N/A"} minutes
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">
                          Your Time vs Average:
                        </span>
                        <span className="font-medium">
                          {testData?.timeSpentMinutes &&
                          benchmarking?.avgTestTime
                            ? testData.timeSpentMinutes <
                              benchmarking.avgTestTime
                              ? `${Math.round(
                                  benchmarking.avgTestTime -
                                    testData.timeSpentMinutes
                                )} mins faster`
                              : `${Math.round(
                                  testData.timeSpentMinutes -
                                    benchmarking.avgTestTime
                                )} mins slower`
                            : "N/A"}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Time Performance:</span>
                        <span
                          className="font-medium"
                          style={{
                            color:
                              testData?.timingPerformance === "Efficient"
                                ? "#10B981"
                                : testData?.timingPerformance === "Average"
                                ? "#F59E0B"
                                : "#DC2626",
                          }}
                        >
                          {testData?.timingPerformance || "N/A"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Time Management Tip:
                  </h4>
                  <p className="text-sm text-blue-700">
                    {testData?.timingPerformance === "Efficient"
                      ? "Great job on time management! Continue this approach for future tests."
                      : testData?.timingPerformance === "Average"
                      ? "Your timing is average. Try to reduce time on easier questions to have more time for challenging ones."
                      : testData?.timingPerformance === "Slow"
                      ? "Consider working on your speed. Practice timed sessions to improve efficiency."
                      : "Practice with timed mock tests to develop better time management strategies."}
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => router.push("/records")}
                  className="px-4 py-2 text-white rounded hover:opacity-90 transition-colors"
                  style={{ backgroundColor: pinkColor }}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
