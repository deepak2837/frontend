// app/question-bank/hooks/useQuestionBank.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchQuestionBankData, recordAttempt } from "../action";

export function useQuestionBank(
  id,
  initialQuestions = [],
  initialTotalPages = 0
) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: "",
    subject: "",
  });
  const [attemptStartTime, setAttemptStartTime] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);

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

  async function fetchQuestions() {
    setIsLoading(true);
    try {
      const result = await fetchQuestionBankData(id, currentPage, filters);

      if (result.success) {
        setQuestions(result.data.questions);
        setTotalPages(result.data.pagination.totalPages);
        setCurrentQuestionIndex(0);
      } else {
        // Handle error
        console.error("Error fetching questions:", result.error);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOptionSelect(option, questionId) {
    const currentQuestion = questions.find((q) => q._id === questionId);
    const isCorrect = option === currentQuestion.answer;

    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: { selected: option, isCorrect },
    }));

    try {
      const timeSpent = attemptStartTime
        ? Math.floor((Date.now() - attemptStartTime) / 1000)
        : 0;

      const formData = new FormData();
      formData.append("userId", localStorage.getItem("userId"));
      formData.append("questionBankId", id);
      formData.append("questionId", questionId);
      formData.append("isCorrect", isCorrect.toString());
      formData.append("timeSpent", timeSpent.toString());
      formData.append("hintsUsed", hintsUsed.toString());

      const result = await recordAttempt(formData);

      if (!result.success) {
        console.error("Error recording attempt:", result.error);
      }

      // Reset attempt tracking
      setAttemptStartTime(null);
      setHintsUsed(0);
    } catch (error) {
      console.error("Error recording attempt:", error);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setIsLoading(true);
      setCurrentPage((prev) => prev + 1);
    }
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setIsLoading(true);
      setCurrentPage((prev) => prev - 1);
    }
  }

  function resetFilters() {
    setFilters({ difficulty: "", subject: "" });
  }

  return {
    questions,
    currentQuestionIndex,
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
    setHintsUsed,
  };
}
