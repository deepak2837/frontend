// app/question-bank/[id]/QuestionBankContent.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import debounce from "lodash.debounce";
import LineLoader from "@/components/common/Loader";
import Image from "next/image";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const DIFFICULTIES = ["easy", "medium", "hard"];
const MEDICAL_SUBJECTS = [
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pathology",
  "Microbiology",
  "Pharmacology",
  "Forensic Medicine",
  "Community Medicine",
  "Ophthalmology",
  "ENT",
  "Medicine",
  "Surgery",
  "Obstetrics",
  "Pediatrics",
  "Orthopedics",
];

export default function QuestionBankContent({
  id,
  initialQuestions = [],
  initialTotalPages = 0,
}) {
  const router = useRouter();
  const { getToken } = useAuthStore();

  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [filter, setFilter] = useState({ subject: "", topic: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptStartTime, setAttemptStartTime] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [userId, setUserId] = useState(null);

  const [filters, setFilters] = useState({
    difficulty: "",
    subject: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setUserId(JSON.parse(user).userId);
      }
    }

    // If no initial questions were passed from SSR, fetch them
    if (initialQuestions.length === 0) {
      fetchQuestions();
    }
  }, []);

  useEffect(() => {
    setAttemptStartTime(Date.now());
    setHintsUsed(0);
  }, [currentQuestionIndex]);

  useEffect(() => {
    // Skip first load if we have initialQuestions
    if (initialQuestions.length > 0 && currentPage === 1 && !isLoading) {
      return;
    }

    if (id) {
      fetchQuestions();
    }
  }, [id, currentPage, filters]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/question-bank/${id}`, // Use our internal API route
        {
          params: {
            page: currentPage,
            limit: 5,
            ...filters,
          },
        }
      );

      setQuestions(response.data.data.questions);
      setTotalPages(response.data.data.pagination.totalPages);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = async (option, questionId) => {
    const isCorrect =
      option === questions.find((q) => q._id === questionId)?.answer;
    const token = getToken();

    if (!token) {
      console.error("No token found");
      return;
    }

    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: { selected: option, isCorrect },
    }));

    try {
      await axios.post(
        `${BASE_URL}/api/v1/user-activities/record-attempt`,
        {
          userId: userId,
          questionBankId: id,
          questionId: questionId,
          isCorrect,
          timeSpent: 0,
          hintsUsed: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(
        "Error recording attempt:",
        error.response?.data || error.message
      );
    }
  };

  const handleNextPage = useCallback(
    debounce(async () => {
      if (currentPage < totalPages && !isLoading) {
        setIsLoading(true);
        setCurrentPage((prev) => prev + 1);
      }
    }, 300),
    [currentPage, totalPages, isLoading]
  );

  const handlePrevPage = useCallback(
    debounce(async () => {
      if (currentPage > 1 && !isLoading) {
        setIsLoading(true);
        setCurrentPage((prev) => prev - 1);
      }
    }, 300),
    [currentPage, isLoading]
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LineLoader />
      </div>
    );

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-xl text-gray-600 font-semibold">
          You have already attempted all the questions of this question bank or
          this filter.
        </p>
        <button
          onClick={() => setFilters({ difficulty: "", subject: "" })}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
        >
          Reset Filters
        </button>
        <button
          onClick={() => router.push("/question-bank")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
        >
          Explore other question banks
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-4 flex-1">
          <select
            value={filters.difficulty}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, difficulty: e.target.value }))
            }
            className="border rounded-lg px-4 py-2 w-full sm:w-auto"
          >
            <option value="">All Difficulties</option>
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.subject}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, subject: e.target.value }))
            }
            className="border rounded-lg px-4 py-2 w-full sm:w-auto"
          >
            <option value="">All Subjects</option>
            {MEDICAL_SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFilters({ difficulty: "", subject: "" })}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 w-full sm:w-auto"
          >
            Reset Filters
          </button>
        </div>

        <button
          onClick={() => router.push("/question-bank")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2 w-full sm:w-auto"
        >
          <span>←</span> Back to Categories
        </button>
      </div>

      <div className="space-y-4">
        <div>
          {questions.map((question) => (
            <div key={question._id} className="border p-4 rounded-xl shadow">
              {question.image && question.image !== "no_image" && (
                <div className="mb-6 flex justify-center">
                  <div className="relative w-full max-w-2xl">
                    <Image
                      src={question.image}
                      alt="Question Image"
                      width={600}
                      height={200}
                      className="rounded-md mx-auto object-contain"
                      style={{ maxHeight: "300px" }}
                      priority
                      unoptimized={true}
                    />
                  </div>
                </div>
              )}

              <h3 className="text-lg font-semibold mb-4">
                {question.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(question.options).map(([key, value]) => {
                  const selectedData = selectedOptions[question._id] || {};
                  const isSelected = selectedData.selected === key;
                  const isCorrect = key === question.answer;
                  const isWrong = isSelected && !isCorrect;

                  return (
                    <button
                      key={key}
                      onClick={() => handleOptionClick(key, question._id)}
                      className={`border p-2 rounded shadow text-left
                      ${
                        isSelected
                          ? isWrong
                            ? "bg-red-200"
                            : "bg-green-200"
                          : ""
                      }
                      ${
                        selectedData.selected && isCorrect ? "bg-green-200" : ""
                      }`}
                      disabled={!!selectedData.selected}
                    >
                      {`${key}) ${value}`}
                    </button>
                  );
                })}
              </div>

              {selectedOptions[question._id] && (
                <div className="mt-4">
                  <p className="text-lg font-semibold">
                    Correct Answer:{" "}
                    <span className="text-green-600">
                      {`${question.answer}) ${
                        question.options[question.answer]
                      }`}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    Explanation: {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-4 justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white p-2 rounded shadow disabled:opacity-50"
        >
          <GrLinkPrevious className="text-xl" />
        </button>
        <p className="text-center text-lg">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white p-2 rounded shadow disabled:opacity-50"
        >
          <GrLinkNext className="text-xl" />
        </button>
      </div>
    </div>
  );
}
