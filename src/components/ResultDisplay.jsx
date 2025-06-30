// app/mock-test/result/[id]/components/ResultDisplay.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Clock,
  Hash,
  CheckCircle,
  XCircle,
  HelpCircle,
  PieChart,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowLeft,
  Home,
  RefreshCw,
  Printer,
  Award,
  BarChart2,
  Target,
  TrendingUp,
  AlertCircle,
  Book,
  ArrowUpRight,
} from "lucide-react";

// Progress ring component for visual score representation
const ProgressRing = ({
  percentage = 0,
  color,
  size = 120,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - ((percentage || 0) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">
          {Math.round(percentage || 0)}%
        </span>
        <span className="text-xs font-medium">Score</span>
      </div>
    </div>
  );
};

// Subject wise analysis component
const SubjectBreakdown = ({ subjects = [] }) => {
  const [expandedSubject, setExpandedSubject] = useState(null);

  const toggleSubject = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Performance by Subject
      </h3>
      <div className="space-y-3">
        {subjects?.map((subject, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-white"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleSubject(subject?.subject)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: getSubjectColor(subject?.accuracy || 0),
                  }}
                ></div>
                <span className="font-medium">
                  {subject?.subject || "Unknown Subject"}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {subject?.correct || 0}/{subject?.totalQuestions || 0} (
                  {Math.round(subject?.accuracy || 0)}%)
                </span>
                {expandedSubject === subject?.subject ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </div>

            {expandedSubject === subject?.subject && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                <div className="text-sm text-gray-700 mb-2">
                  <div className="flex justify-between mb-1">
                    <span>Total Questions:</span>
                    <span className="font-medium">
                      {subject?.totalQuestions || 0}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Attempted:</span>
                    <span className="font-medium">
                      {subject?.attempted || 0}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Correct:</span>
                    <span className="font-medium text-green-600">
                      {subject?.correct || 0}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Incorrect:</span>
                    <span className="font-medium text-red-600">
                      {subject?.incorrect || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-medium">
                      {subject?.accuracy || 0}%
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-grow bg-gray-200 h-2 rounded-full">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${subject?.accuracy || 0}%`,
                          backgroundColor: getSubjectColor(
                            subject?.accuracy || 0
                          ),
                        }}
                      />
                    </div>
                    <span className="ml-2 text-xs font-medium">
                      {subject?.accuracy || 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Incorrect answers component
const IncorrectAnswers = ({ incorrectAnswers = [] }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  if (!incorrectAnswers?.length) {
    return (
      <div className="p-4 bg-green-50 rounded-lg text-center">
        <CheckCircle size={24} className="mx-auto text-green-500 mb-2" />
        <p className="text-green-700 font-medium">
          Great job! You did not get any questions wrong.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <AlertCircle size={20} className="mr-2 text-amber-500" />
        Questions to Review
      </h3>
      <div className="space-y-3">
        {incorrectAnswers?.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-white"
          >
            <div
              className="flex items-start justify-between p-4 cursor-pointer"
              onClick={() => toggleQuestion(index)}
            >
              <div className="flex items-start space-x-3">
                <XCircle
                  size={20}
                  className="text-red-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <span className="font-medium text-gray-800">
                    {item?.questionText || "Unknown question"}
                  </span>
                  <div className="mt-1 text-sm">
                    <span className="text-red-600">
                      Your answer: Option{" "}
                      {(item?.userAnswer || "").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              {expandedQuestion === index ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>

            {expandedQuestion === index && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                <div className="p-3 bg-green-50 rounded-md">
                  <span className="font-medium text-green-700">
                    Correct answer: Option{" "}
                    {(item?.correctAnswer || "").toUpperCase()}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="font-medium text-gray-700">
                    Explanation:
                  </span>
                  <p className="mt-1 text-gray-600">
                    {item?.explanation || "No explanation available"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Benchmarking component
const Benchmarking = ({ benchmarking = {} }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Award size={20} className="mr-2 text-blue-500" />
        Performance Benchmarking
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h4 className="text-sm font-medium text-gray-500">Your Percentile</h4>
          <div className="mt-1 text-xl font-bold text-gray-800">
            {benchmarking?.yourPercentile || 0}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            You performed better than {benchmarking?.yourPercentile || 0}% of
            test takers
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <h4 className="text-sm font-medium text-gray-500">Top Performers</h4>
          <div className="mt-1 text-xl font-bold text-gray-800">
            {Math.round(benchmarking?.topPerformersAverage || 0)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Average score of top performers
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
          <h4 className="text-sm font-medium text-gray-500">Target Score</h4>
          <div className="mt-1 text-xl font-bold text-gray-800">
            {Math.round(benchmarking?.targetScore || 0)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Score to aim for on your next attempt
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h4 className="text-sm font-medium text-gray-500">
            Improvement Needed
          </h4>
          <div className="mt-1 text-xl font-bold text-gray-800">
            {Math.round(
              benchmarking?.estimatedImprovement ||
                (benchmarking?.targetScore || 0) -
                  (benchmarking?.yourPercentile || 0)
            )}
            %
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Required improvement to reach target
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color based on score percentage
const getScoreColor = (percentage = 0) => {
  if (percentage >= 80) return "text-green-500";
  if (percentage >= 60) return "text-blue-500";
  if (percentage >= 40) return "text-yellow-500";
  return "text-red-500";
};

const getRingColor = (percentage = 0) => {
  if (percentage >= 80) return "#10B981"; // green-500
  if (percentage >= 60) return "#3B82F6"; // blue-500
  if (percentage >= 40) return "#FBBF24"; // yellow-500
  return "#EF4444"; // red-500
};

const getSubjectColor = (percentage = 0) => {
  if (percentage >= 80) return "#10B981"; // green-500
  if (percentage >= 60) return "#3B82F6"; // blue-500
  if (percentage >= 40) return "#FBBF24"; // yellow-500
  return "#EF4444"; // red-500
};

// Stat card component
const StatCard = ({ icon, label, value, className = "" }) => (
  <div
    className={`bg-white p-4 rounded-lg shadow-sm flex items-center space-x-3 ${className}`}
  >
    <div className="p-2 rounded-full bg-blue-50 text-blue-500">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

// Performance Summary Card
const PerformanceSummaryCard = ({
  rank = 0,
  passed = false,
  passingScore = 50,
  scorePercentage = 0,
}) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Performance Summary
      </h3>
      <div className="flex items-center space-x-2">
        <Trophy className="text-amber-500" size={18} />
        <span className="font-medium text-gray-700">Rank: #{rank}</span>
      </div>
    </div>

    <div className="flex items-center mt-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full"
          style={{
            width: `${scorePercentage || 0}%`,
            backgroundColor: getRingColor(scorePercentage),
          }}
        ></div>
      </div>
      <span className="ml-2 text-sm font-medium text-gray-700">
        {Math.round(scorePercentage || 0)}%
      </span>
    </div>

    <div className="flex justify-between mt-2 text-xs text-gray-500">
      <span>0%</span>
      <span className="text-red-500">Failing ({passingScore}%)</span>
      <span>100%</span>
    </div>

    <div className="mt-4">
      <div
        className={`py-2 px-4 rounded-full text-white text-sm font-medium inline-flex items-center ${
          passed ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {passed ? (
          <>
            <CheckCircle size={16} className="mr-1" />
            <span>PASSED</span>
          </>
        ) : (
          <>
            <XCircle size={16} className="mr-1" />
            <span>FAILED</span>
          </>
        )}
      </div>
    </div>
  </div>
);

// Helper functions
const formatTime = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
};

// Main result display component
export default function ResultDisplay({ result = {} }) {
  const router = useRouter();

  // Extract result data with optional chaining
  const {
    totalQuestions = 0,
    correctAnswers = 0,
    incorrectAnswers = 0,
    incorrectAnswersDetails = [],
    subjectWiseAnalysis = [],
    benchmarking = {},
    score = 0,
    percentage = 0,
    passed = false,
    rank = 0,
    createdAt,
  } = result || {};

  const passingScore = 50; // Default passing score if not provided
  const skippedQuestions = totalQuestions - correctAnswers - incorrectAnswers;
  const testName = "Mock Medical Examination";
  const subject = "Medical Sciences";

  // For time taken (mock data since it's not in the provided data)
  const timeTaken = 1800; // 30 minutes in seconds
  const formattedTime = formatTime(timeTaken);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Integrated navigation and header banner */}
      <div
        className={`p-6 rounded-lg mb-6 ${
          passed ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push("/mock-test")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Tests</span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Home size={18} />
            <span className="hidden sm:block">Home</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-2">
          <div className="flex flex-col mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">
              {testName || "Mock Test Results"}
            </h1>
            <p className="text-gray-600">{subject || "Healthcare Sciences"}</p>
            <p className="text-sm text-gray-500 mt-1">
              Completed on{" "}
              {createdAt
                ? new Date(createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "Unknown date"}
            </p>
          </div>
          <div
            className={`px-6 py-2 rounded-full text-white font-bold flex items-center ${
              passed ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {passed ? (
              <>
                <CheckCircle size={18} className="mr-2" />
                PASSED
              </>
            ) : (
              <>
                <XCircle size={18} className="mr-2" />
                FAILED
              </>
            )}
          </div>
        </div>
      </div>

      {/* Score summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Overall Score
          </h3>
          <ProgressRing
            percentage={percentage}
            color={getRingColor(percentage)}
          />
          <div className="mt-4 text-center">
            <p className={`text-lg font-medium ${getScoreColor(percentage)}`}>
              {passed ? "Passed! Well done!" : "Not passed. Keep studying!"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Passing score: {passingScore}%
            </p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<CheckCircle size={20} />}
              label="Correct Answers"
              value={`${correctAnswers} (${
                totalQuestions
                  ? Math.round((correctAnswers / totalQuestions) * 100)
                  : 0
              }%)`}
            />
            <StatCard
              icon={<XCircle size={20} />}
              label="Incorrect Answers"
              value={`${incorrectAnswers} (${
                totalQuestions
                  ? Math.round((incorrectAnswers / totalQuestions) * 100)
                  : 0
              }%)`}
            />
            <StatCard
              icon={<Hash size={20} />}
              label="Total Questions"
              value={totalQuestions}
            />
            <StatCard
              icon={<Trophy size={20} />}
              label="Rank"
              value={`#${rank}`}
            />
          </div>

          <PerformanceSummaryCard
            rank={rank}
            passed={passed}
            passingScore={passingScore}
            scorePercentage={percentage}
          />
        </div>
      </div>

      {/* Benchmarking section */}
      <div className="mb-8">
        <Benchmarking benchmarking={benchmarking} />
      </div>

      {/* Subject wise analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <SubjectBreakdown subjects={subjectWiseAnalysis} />
      </div>

      {/* Incorrect answers section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <IncorrectAnswers incorrectAnswers={incorrectAnswersDetails} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => router.push("/mock-test")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText size={18} />
          <span>Take Another Test</span>
        </button>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={18} />
          <span>Retry This Test</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Printer size={18} />
          <span>Print Results</span>
        </button>
      </div>

      {/* Learning resources */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <Book size={20} className="mr-2 text-blue-500" />
          Recommended Resources
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-blue-600 flex items-center">
              Practice Questions
              <ArrowUpRight size={16} className="ml-1" />
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Additional practice questions focused on your weak areas
            </p>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-blue-600 flex items-center">
              Study Materials
              <ArrowUpRight size={16} className="ml-1" />
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive study guides for test preparation
            </p>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-blue-600 flex items-center">
              Video Tutorials
              <ArrowUpRight size={16} className="ml-1" />
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Instructional videos explaining difficult concepts
            </p>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-blue-600 flex items-center">
              Study Groups
              <ArrowUpRight size={16} className="ml-1" />
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Join study groups with other test takers
            </p>
          </div>
        </div>
      </div>

      {/* Improvement plan */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <TrendingUp size={20} className="mr-2 text-green-500" />
          Improvement Plan
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">Focus Areas</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {subjectWiseAnalysis
                ?.filter((subject) => (subject?.accuracy || 0) < 70)
                .slice(0, 3)
                .map((subject, index) => (
                  <li key={index}>
                    {subject?.subject || "Unknown Subject"} (
                    {Math.round(subject?.accuracy || 0)}%)
                  </li>
                )) || <li>All subjects are performing well!</li>}
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-700 mb-2">Strong Areas</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {subjectWiseAnalysis
                ?.filter((subject) => (subject?.accuracy || 0) >= 70)
                .slice(0, 3)
                .map((subject, index) => (
                  <li key={index}>
                    {subject?.subject || "Unknown Subject"} (
                    {Math.round(subject?.accuracy || 0)}%)
                  </li>
                )) || <li>Keep practicing to improve all areas</li>}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Next Steps</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-amber-50 text-amber-500 mr-3">
                  <Target size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Set Target Score</p>
                  <p className="text-sm text-gray-600">
                    Aim for {Math.min(100, Math.round((percentage || 0) + 10))}%
                    on your next attempt
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-blue-50 text-blue-500 mr-3">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Time Management</p>
                  <p className="text-sm text-gray-600">
                    Improve your pace to answer more questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mb-8">
        <p>© {new Date().getFullYear()} Medical Test Prep Platform</p>
        <p className="mt-1">All rights reserved</p>
      </div>
    </div>
  );
}
