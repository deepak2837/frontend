"use client";
// app/mock-test/[type]/[name]/MedicalExamContent.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import {
  MdOutlineAccessTime,
  MdQuiz,
  MdTrendingUp,
  MdOutlineLocalHospital,
  MdSearch,
  MdArrowBack,
} from "react-icons/md";
import useAuthStore from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const DEFAULT_IMAGE = "/images/default-test-image.jpg";

export default function MedicalExamContent({
  initialTests,
  initialError,
  type,
  name,
}) {
  const [tests, setTests] = useState(initialTests || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const router = useRouter();
  const { getToken } = useAuthStore();

  // Only refetch if no initial data or there was an error
  useEffect(() => {
    if ((initialTests.length === 0 || initialError) && type && name) {
      fetchTests();
    }
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const queryParams = new URLSearchParams({
        testType: type || "",
        examName: name || "",
      });

      const response = await fetch(
        `${BASE_URL}/api/v1/mock-test/live-tests?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to fetch tests");
      }

      const data = await response.json();
      if (data?.success) {
        setTests(data.data || []);
      } else {
        throw new Error(data?.message || "Failed to fetch tests");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch tests");
      toast.error(error.message || "Failed to fetch tests");
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test?.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      filterDifficulty === "all" || test?.difficultyLevel === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchTests}
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const formattedName = name
    ? name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Medical";

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div
        className="bg-gradient-to-r from-pink-500 to-orange-400 text-white py-8 px-4 sm:py-12 sm:px-6"
        style={{
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        }}
      >
        {/* Mobile Layout - Button Above Content */}
        <div className="block lg:hidden mb-4">
          <button
            onClick={() => router.push("/mock-test")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 text-gray-700 hover:text-pink-600 text-sm"
          >
            <MdArrowBack className="h-4 w-4" />
            <span className="font-medium">Back to All Tests</span>
          </button>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              {formattedName} Practice Exams
            </h1>
            <p className="text-base sm:text-lg opacity-90 max-w-3xl">
              Master your medical knowledge with our comprehensive collection of{" "}
              {formattedName} practice exams.
            </p>
          </div>

          {/* Desktop Button - Hidden on Mobile */}
          <div className="hidden lg:block">
            <button
              onClick={() => router.push("/mock-test")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 text-gray-700 hover:text-pink-600"
            >
              <MdArrowBack className="h-5 w-5" />
              <span className="font-medium">Back to All Tests</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search exams by name or description..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-gray-700">Difficulty:</span>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {filteredTests.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No exams found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTests.map((test) => (
              <div
                key={test?._id || `test-${Math.random()}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100 flex flex-col"
              >
                {/* Image Container with Overlay Elements - Reduced height */}
                <div className="relative h-32 sm:h-40">
                  {/* Using next/image safely with error handling */}
                  {test?.image ? (
                    <Image
                      src={test.image}
                      alt={test?.testName || "Test image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      style={{ objectFit: "cover" }}
                      className="transition-all duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MdOutlineLocalHospital className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  {/* Top Right Elements: Difficulty & Status - Made smaller */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(
                        test?.difficultyLevel
                      )}`}
                    >
                      {test?.difficultyLevel || "Unknown"}
                    </span>

                    {/* Status badge - made smaller */}
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {test?.status || "Available"}
                    </span>
                  </div>

                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  {/* Tags on the image (bottom right) - Made smaller */}
                  <div className="absolute bottom-2 right-2 flex gap-1 flex-wrap justify-end max-w-[60%] z-10">
                    {(test?.tags || ["Medical", "MCQ"])
                      .slice(0, 2)
                      .map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-0.5 bg-white/80 backdrop-blur-sm text-gray-800 rounded-md font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Content section - Reduced padding */}
                <div className="p-3 sm:p-4 flex-grow">
                  {/* Test name - Smaller font size */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-1">
                    {test?.testName || "Unnamed Test"}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {test?.description || "No description available"}
                  </p>

                  {/* Info grid - Condensed */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <MdOutlineAccessTime className="text-pink-600 h-4 w-4" />
                      <span className="text-gray-700">
                        {test?.timeLimit || 0} mins
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MdQuiz className="text-pink-600 h-4 w-4" />
                      <span className="text-gray-700">
                        {test?.numberOfQuestions || 0} Questions
                      </span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <MdTrendingUp className="text-pink-600 h-4 w-4" />
                      <span className="text-gray-700">
                        Pass: {test?.passPercentage || 0}%
                      </span>
                    </div>
                  </div>

                  {/* Button - Less padding */}
                  <button
                    onClick={() =>
                      router.push(`/mock-test/take-test/${test?._id}`)
                    }
                    className="w-full text-white py-2 px-4 rounded-md font-medium transition flex items-center justify-center gap-1 text-sm"
                    style={{
                      background:
                        "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    }}
                  >
                    {test?.isAttempted ? `Re-Attempt Exam` : `Start Exam`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Study Resources Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Study Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg text-white"
                style={{
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Comprehensive Notes
                </h3>
                <p className="text-gray-600 text-sm">
                  Access detailed study materials to prepare for your exams
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg text-white"
                style={{
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Practice Questions
                </h3>
                <p className="text-gray-600 text-sm">
                  Thousands of practice questions with detailed explanations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg text-white"
                style={{
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Performance Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  Track your progress and identify areas for improvement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}
