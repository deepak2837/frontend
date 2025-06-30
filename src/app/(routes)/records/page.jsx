"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LineLoader from "@/components/common/Loader";
import useAuthStore from "@/store/authStore";
import {
  Heart,
  Award,
  Clock,
  Book,
  FileText,
  ArrowRight,
  BarChart2,
} from "lucide-react";

// Custom color palette
const pinkColor = "#FE6B8B";
const orangeColor = "#FF8E53";
const lightPinkBorder = "#FED7DD";
const lightPinkBg = "#FFF0F3";
const lightOrangeBg = "#FFF4EC";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function RecordsList() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    passRate: 0,
    bestSubject: "",
  });
  const { getToken } = useAuthStore();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/v1/results/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch records");
        }

        const data = await response.json();
        const fetchedRecords = data.data || [];
        setRecords(fetchedRecords);

        // Calculate stats
        if (fetchedRecords.length > 0) {
          const totalTests = fetchedRecords.length;
          const totalScore = fetchedRecords.reduce(
            (sum, record) => sum + (record.score || 0),
            0
          );
          const averageScore = totalScore / totalTests;
          const passedTests = fetchedRecords.filter(
            (record) => record.passed
          ).length;
          const passRate = (passedTests / totalTests) * 100;

          // This is a placeholder - in a real app you might have subject categories
          const subjects = {};
          fetchedRecords.forEach((record) => {
            const subject = record.testId?.category || "General Health";
            if (!subjects[subject]) subjects[subject] = { count: 0, score: 0 };
            subjects[subject].count++;
            subjects[subject].score += record.score || 0;
          });

          let bestSubject = "General Health";
          let highestAvg = 0;

          Object.entries(subjects).forEach(([subject, data]) => {
            const avg = data.score / data.count;
            if (avg > highestAvg) {
              highestAvg = avg;
              bestSubject = subject;
            }
          });

          setStats({
            totalTests,
            averageScore: averageScore.toFixed(2),
            passRate: passRate.toFixed(2),
            bestSubject,
          });
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [getToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LineLoader />
      </div>
    );
  }

  if (!records.length) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]"
        style={{ backgroundColor: lightPinkBg }}
      >
        <div
          className="text-center bg-white rounded-xl shadow-md p-8 max-w-lg"
          style={{ borderColor: lightPinkBorder, borderWidth: "1px" }}
        >
          <div className="mb-6 flex justify-center">
            <Book size={60} style={{ color: pinkColor }} />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            No Assessment Records Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You have not completed any health education assessments yet. Taking
            assessments helps track your progress and identify areas for
            improvement in your healthcare knowledge.
          </p>
          <button
            onClick={() => router.push("/mock-test")}
            className="text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 w-full transition-all"
            style={{
              background: `linear-gradient(45deg, ${pinkColor}, ${orangeColor})`,
            }}
          >
            Start Your First Assessment <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: lightPinkBg }}
      className="min-h-screen pb-12"
    >
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Health Education Progress
          </h1>
          <p className="text-gray-600">
            Track your learning journey and identify areas for improvement
          </p>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div
            className="bg-white rounded-xl p-5 shadow-sm flex flex-col"
            style={{ borderColor: lightPinkBorder, borderWidth: "1px" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: lightPinkBg }}
              >
                <FileText size={20} style={{ color: pinkColor }} />
              </div>
              <h3 className="text-gray-500 font-medium">Total Assessments</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-auto">
              {stats.totalTests}
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-5 shadow-sm flex flex-col"
            style={{ borderColor: lightPinkBorder, borderWidth: "1px" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: lightOrangeBg }}
              >
                <BarChart2 size={20} style={{ color: orangeColor }} />
              </div>
              <h3 className="text-gray-500 font-medium">Average Score</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-auto">
              {stats.averageScore}%
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-5 shadow-sm flex flex-col"
            style={{ borderColor: lightPinkBorder, borderWidth: "1px" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: lightPinkBg }}
              >
                <Award size={20} style={{ color: pinkColor }} />
              </div>
              <h3 className="text-gray-500 font-medium">Pass Rate</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-auto">
              {stats.passRate}%
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-5 shadow-sm flex flex-col"
            style={{ borderColor: lightPinkBorder, borderWidth: "1px" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: lightOrangeBg }}
              >
                <Heart size={20} style={{ color: orangeColor }} />
              </div>
              <h3 className="text-gray-500 font-medium">Strongest Area</h3>
            </div>
            <p className="text-xl font-bold text-gray-800 mt-auto truncate">
              {stats.bestSubject}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Assessment History
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {records.map((record) => (
            <div
              key={record._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
              style={{ borderColor: lightPinkBorder, borderWidth: "1px" }}
              onClick={() =>
                router.push(`/records/result/${record.testId._id}`)
              }
            >
              <div className="relative">
                <img
                  src={
                    record.testId?.image ||
                    "/images/health-education-default.jpg"
                  }
                  alt={record.testId?.testName || "Health Assessment"}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-white text-lg font-semibold line-clamp-2">
                    {record.testId?.testName || "Health Assessment"}
                  </h3>
                </div>

                {record.rank && (
                  <div
                    className="absolute top-3 right-3 text-white font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"
                    style={{ backgroundColor: orangeColor }}
                  >
                    <Award size={14} />
                    <span>Rank #{record.rank}</span>
                  </div>
                )}

                {record.passed ? (
                  <div
                    className="absolute top-3 left-3 text-white font-medium px-3 py-1 rounded-full text-sm shadow-sm"
                    style={{ backgroundColor: pinkColor }}
                  >
                    Passed
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 bg-red-500 text-white font-medium px-3 py-1 rounded-full text-sm shadow-sm">
                    Needs Review
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div
                    className="rounded-lg p-2 text-center"
                    style={{ backgroundColor: lightPinkBg }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: pinkColor }}
                    >
                      Score
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {record.score?.toFixed(2) || "0"}%
                    </p>
                  </div>

                  <div
                    className="rounded-lg p-2 text-center"
                    style={{ backgroundColor: lightOrangeBg }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: orangeColor }}
                    >
                      Correct
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {record.correctAnswers}/{record.totalQuestions}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {record.testId?.category && (
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{ backgroundColor: lightPinkBg, color: pinkColor }}
                    >
                      {record.testId.category}
                    </span>
                  )}
                </div>

                <button
                  className="w-full py-2.5 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  style={{
                    background: `linear-gradient(45deg, ${pinkColor}, ${orangeColor})`,
                  }}
                >
                  View Detailed Analysis <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-6 shadow-sm"
          style={{
            backgroundColor: lightPinkBg,
            borderColor: lightPinkBorder,
            borderWidth: "1px",
          }}
        >
          <h3 className="text-xl font-bold mb-3" style={{ color: pinkColor }}>
            Health Education Tips
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div
                className="p-1 rounded-full mt-0.5"
                style={{ backgroundColor: "#FFDCE5" }}
              >
                <Heart size={16} style={{ color: pinkColor }} />
              </div>
              <p className="text-gray-700">
                Review assessments where you scored below 70% to strengthen your
                knowledge in weaker areas.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div
                className="p-1 rounded-full mt-0.5"
                style={{ backgroundColor: "#FFDCE5" }}
              >
                <Heart size={16} style={{ color: pinkColor }} />
              </div>
              <p className="text-gray-700">
                Try to take at least one new assessment every week to
                continuously improve your healthcare knowledge.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div
                className="p-1 rounded-full mt-0.5"
                style={{ backgroundColor: "#FFDCE5" }}
              >
                <Heart size={16} style={{ color: pinkColor }} />
              </div>
              <p className="text-gray-700">
                Focus on understanding concepts rather than memorizing answers
                for better long-term retention.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
