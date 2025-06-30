"use client";

// app/mock-tests/MockTestsClient.jsx
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
import LineLoader from "@/components/common/Loader";

const MockTestsClient = ({ initialTests, initialError }) => {
  const [tests, setTests] = useState(initialTests || []);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isError, setIsError] = useState(Boolean(initialError));
  const router = useRouter();

  // Gradient style object
  const pinkOrangeGradient = {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  };

  useEffect(() => {
    // Set initial active category if tests are available
    if (initialTests && initialTests.length > 0 && activeCategory === null) {
      const categoriesFound = [
        ...new Set(initialTests.map((t) => t.testType || "Unknown")),
      ];
      categoriesFound.sort((a, b) => {
        const order = { Exam: 1, Subject: 2, Course: 3, Unknown: 4 };
        return (order[a] || 99) - (order[b] || 99);
      });
      if (categoriesFound.length > 0) {
        setActiveCategory(categoriesFound[0]);
      }
    }
  }, [initialTests, activeCategory]);

  const groupedTests = tests.reduce((acc, test) => {
    const type = test.testType || "Unknown";
    const name = test.testName || "Unnamed Test";
    if (!acc[type]) {
      acc[type] = {};
    }
    if (!acc[type][name]) {
      acc[type][name] = [];
    }
    acc[type][name].push(test);
    return acc;
  }, {});

  const getCategoryIcon = (category) => {
    const catLower =
      typeof category === "string" ? category.toLowerCase() : "default";
    const icons = {
      exam: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      clinical: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 16l-1.879-1.879a5.25 5.25 0 010-7.424L12 1l5.879 5.879a5.25 5.25 0 010 7.424L16 16M12 19v-6"
          />
        </svg>
      ),
      anatomy: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      pharmacy: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      pathology: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
      ),
      subject: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      course: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      ),
      default: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    };
    return icons[catLower] || icons.default;
  };

  const categories = useMemo(() => {
    return Object.keys(groupedTests).sort((a, b) => {
      const order = { Exam: 1, Subject: 2, Course: 3, Unknown: 4 };
      return (order[a] || 99) - (order[b] || 99);
    });
  }, [groupedTests]);

  const getDifficultyLevel = (testsArray) => {
    const difficulties = [...new Set()];
    if (difficulties.length > 0) {
      if (difficulties.includes("Hard")) return "Hard";
      if (difficulties.includes("Medium")) return "Medium";
      if (difficulties.includes("Easy")) return "Easy";
      return difficulties[0];
    }
    const testName = testsArray[0]?.testName || "";
    const length = testName.length;
    if (length === 0) return "Beginner";
    if (length % 3 === 0) return "Advanced";
    if (length % 3 === 1) return "Intermediate";
    return "Beginner";
  };

  const getDifficultyColor = (level) => {
    const levelLower = level?.toLowerCase();
    if (levelLower === "advanced" || levelLower === "hard")
      return "text-red-600 bg-red-100/80";
    if (levelLower === "intermediate" || levelLower === "medium")
      return "text-amber-600 bg-amber-100/80";
    if (levelLower === "beginner" || levelLower === "easy")
      return "text-green-600 bg-green-100/80";
    return "text-gray-600 bg-gray-100/80";
  };

  if (loading) {
    return <LineLoader />;
  }

  if (isError || !tests) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-6"
        style={{
          background: "linear-gradient(45deg, #FE6B8B 10%, #FF8E53 90%)",
        }}
      >
        <div className="bg-white/90 p-6 rounded-xl shadow-md max-w-md w-full text-center border border-red-200">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Unable to Load Tests
          </h2>
          <p className="text-gray-600 mb-4">
            An error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={pinkOrangeGradient}
            className="px-6 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition-colors shadow-md flex items-center justify-center gap-2 mx-auto text-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: "linear-gradient(135deg, #FFE6EC 0%, #FFF3E0 100%)",
      }}
    >
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm mb-8 p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="flex items-center p-3 rounded-lg"
              style={{
                background:
                  "linear-gradient(45deg, rgba(254,107,139,0.1) 0%, rgba(255,142,83,0.1) 100%)",
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full text-white mr-3"
                style={pinkOrangeGradient}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Test Groups</p>
                <p className="text-xl font-bold" style={{ color: "#FE6B8B" }}>
                  {Object.values(groupedTests).reduce(
                    (sum, category) => sum + Object.keys(category).length,
                    0
                  )}
                </p>
              </div>
            </div>
            <div
              className="flex items-center p-3 rounded-lg"
              style={{
                background:
                  "linear-gradient(45deg, rgba(254,107,139,0.1) 0%, rgba(255,142,83,0.1) 100%)",
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full text-white mr-3"
                style={pinkOrangeGradient}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">Test Categories</p>
                <p className="text-xl font-bold" style={{ color: "#FF8E53" }}>
                  {categories.length}
                </p>
              </div>
            </div>
            <div
              className="flex items-center p-3 rounded-lg"
              style={{
                background:
                  "linear-gradient(45deg, rgba(254,107,139,0.1) 0%, rgba(255,142,83,0.1) 100%)",
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full text-white mr-3"
                style={pinkOrangeGradient}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Practice Tests</p>
                <p className="text-xl font-bold" style={{ color: "#FE6B8B" }}>
                  {tests.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-1 min-w-max pb-2 pt-2">
            {categories.map((category) => {
              const categoryKey =
                typeof category === "string"
                  ? category.toLowerCase()
                  : "default";
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition  flex items-center ${
                    activeCategory === category
                      ? `text-white shadow-md`
                      : `bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200`
                  }`}
                  style={activeCategory === category ? pinkOrangeGradient : {}}
                >
                  <span className="mr-2">{getCategoryIcon(categoryKey)}</span>
                  {typeof category === "string"
                    ? category.charAt(0).toUpperCase() + category.slice(1)
                    : "Unknown Category"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Test Cards */}
        {activeCategory && groupedTests[activeCategory] && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">{getCategoryIcon(activeCategory)}</span>
              {typeof activeCategory === "string"
                ? activeCategory.charAt(0).toUpperCase() +
                  activeCategory.slice(1)
                : "Selected"}{" "}
              Test Banks
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.keys(groupedTests[activeCategory]).map(
                (testName, image) => {
                  const tests = groupedTests[activeCategory][testName];
                  if (!Array.isArray(tests) || tests.length === 0) {
                    return null;
                  }

                  const difficulty = getDifficultyLevel(tests);
                  const difficultyColor = getDifficultyColor(difficulty);

                  return (
                    <div
                      key={testName}
                      onClick={() =>
                        router.push(
                          `/mock-test/${encodeURIComponent(
                            activeCategory.toLowerCase()
                          )}/${encodeURIComponent(
                            testName.toLowerCase().replace(/\s+/g, "-")
                          )}`
                        )
                      }
                      className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1 border border-gray-100 hover:border-transparent"
                    >
                      {/* Card Header */}
                      <div className="h-48 relative overflow-hidden rounded-t-xl group">
                        {/* Background Image */}
                        {tests.map((test, idx) => (
                          <Image
                            key={idx}
                            src={test.image || "/placeholder-image.jpg"} // Add a fallback
                            alt={`${testName} background`}
                            fill
                            style={{ objectFit: "cover" }}
                            priority={idx === 0} // First image loads with priority
                          />
                        ))}

                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

                        {/* Original Content Overlay - Positioned absolutely */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                          {/* Top Badges */}
                          <div className="flex justify-between items-start">
                            <span className="inline-block bg-white/90 backdrop-blur-sm text-orange-500 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                              {typeof activeCategory === "string"
                                ? activeCategory.toUpperCase()
                                : "N/A"}
                            </span>
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${difficultyColor}`}
                            >
                              {difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-black mb-2 truncate drop-shadow-md">
                            {testName}
                          </h3>
                          <div className="flex items-center mb-3 pb-3 border-b border-gray-100">
                            <span
                              className="flex items-center justify-center w-10 h-10 rounded-full mr-3 flex-shrink-0 text-white"
                              style={pinkOrangeGradient}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </span>
                            <div>
                              <p className="text-sm text-gray-500">
                                Available Tests
                              </p>
                              <p className="font-medium text-gray-700">
                                {tests.length}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {tests[0]?.durationMinutes && (
                              <div className="flex items-center text-sm text-gray-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-2 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {tests[0].durationMinutes} min duration
                              </div>
                            )}
                            {tests[0]?.questionCount && (
                              <div className="flex items-center text-sm text-gray-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-2 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                {tests[0].questionCount} questions
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                          style={pinkOrangeGradient}
                        >
                          Start Practice
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              ></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No tests available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              We could not find any practice tests. Please check again later.
            </p>
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default MockTestsClient;
