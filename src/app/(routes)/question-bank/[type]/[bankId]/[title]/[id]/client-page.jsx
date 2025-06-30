// app/question-bank/[id]/client-page.jsx
"use client";

import React from "react";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import LineLoader from "@/components/common/Loader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuestionBank } from "@/app/(routes)/question-bank/hook/useQuestionBanks";

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

export default function QuestionBankClientPage({
  id,
  initialQuestions = [],
  initialTotalPages = 0,
}) {
  const router = useRouter();

  const {
    questions,
    selectedOptions,
    currentPage,
    totalPages,
    isLoading,
    filters,
    setFilters,
    handleOptionSelect,
    handleNextPage,
    handlePrevPage,
    resetFilters,
  } = useQuestionBank(id, initialQuestions, initialTotalPages);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LineLoader />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-xl text-gray-600 font-semibold">
          You have already attempted all the questions of this question bank or
          this filter.
        </p>
        <button
          onClick={resetFilters}
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
            onClick={resetFilters}
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
                      onClick={() => handleOptionSelect(key, question._id)}
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
