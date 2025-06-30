"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import OptionButton from "@/components/Mocktest/OptionButton";
import Timer from "@/components/Mocktest/Timer";
import { useParams } from "next/navigation";
import Image from "next/image";
import LineLoader from "@/components/common/Loader";
import useGetMockTestQuestions from "@/hooks/mock-test/useGetMockTestQuestions";
import useSubmitMockTest from "@/hooks/mock-test/useSubmitMockTest";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Rating,
} from "@mui/material";
import axios from "axios";
import useAuthStore from "@/store/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function TakeTest() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: "",
  });
  const [submittedTestId, setSubmittedTestId] = useState(null);
  const { getToken } = useAuthStore();

  const { data, isLoading, isError } = useGetMockTestQuestions(id);
  const { onSubmitTest, isLoading: formSubmitLoading } = useSubmitMockTest();

  useEffect(() => {
    if (data && data?.data?.questions) {
      setQuestions(data?.data?.questions);
      setSelectedOptions(Array(data?.data?.questions.length).fill(null));
      setTimeLimit(data?.data.duration);

      // Request fullscreen immediately when questions load
      if (data?.data?.questions.length > 0) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
      }
    }
  }, [data]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isSubmitted) {
        setWarningMessage("You left the test window. The test will now end.");
        setShowWarning(true);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isSubmitted && !isSubmitting) {
        setWarningMessage(
          "You exited full-screen mode. The test will now end."
        );
        setShowWarning(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isSubmitted, isSubmitting]);

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    }
  };

  const requestFullscreen = () => {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error("Error attempting to enable fullscreen:", err);
    });
    setShowWarning(false);
  };

  const handleSubmit = async (submitReason = "normal") => {
    if (isSubmitting || isSubmitted) {
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedAnswers = selectedOptions.map((option, index) => ({
        questionId: questions[index]._id,
        selectedOption: option !== null ? option : -1,
      }));

      const formData = {
        mockTestId: id,
        answers: formattedAnswers,
        submitReason,
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/mock-test/submit-attempt/${data?.data?.attemptId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response?.data?.success && response?.data?.data?.testId) {
        exitFullscreen();
        setIsSubmitted(true);
        setSubmittedTestId(response.data.data.testId);
        sessionStorage.setItem("testSubmitted", "true");
        sessionStorage.setItem("testId", id);
        sessionStorage.setItem("attemptId", response.data.data.attemptId);
        setShowFeedbackModal(true);
      } else {
        throw new Error(response?.data?.error || "Failed to submit test");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/v1/feedback`,
        {
          testId: id,
          rating: feedback.rating,
          comment: feedback.comment,
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      router.push(`/mock-test/result/${submittedTestId}`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      router.push(`/mock-test/result/${submittedTestId}`);
    }
  };

  const handleTimeUp = () => {
    if (!isSubmitted && !isSubmitting) {
      setShowTimeoutDialog(true);
      handleSubmit("timeout");
    }
  };

  const handleWarningConfirm = () => {
    if (!isSubmitted && !isSubmitting) {
      setShowWarning(false);
      handleSubmit(
        document.visibilityState === "hidden" ? "tab_switch" : "fullscreen_exit"
      );
    }
  };

  const handleSelectOption = (optionIndex) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Show error UI for different error cases
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LineLoader />
      </div>
    );
  }

  // Updated error handling for no questions or data
  if (isError || !data || !data.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Test
          </h2>
          <p className="text-gray-700 mb-6">
            We could not load the test data. This might be due to a network
            issue or the test may no longer be available.
          </p>
          <button
            onClick={() => router.push("/mock-test")}
            className="px-4 py-2 bg-main text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Return to Mock Tests
          </button>
        </div>
      </div>
    );
  }

  // New specific handling for when data exists but questions array is empty
  if (!data?.data?.questions || data.data.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-amber-600 mb-4">
            No Questions Available
          </h2>
          <p className="text-gray-700 mb-6">
            This test does not have any questions available at the moment.
            Please try another test or check back later.
          </p>
          <button
            onClick={() => router.push("/mock-test")}
            className="px-4 py-2 bg-main text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Return to Mock Tests
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const optionsArray = currentQuestion
    ? Object.entries(currentQuestion?.options).map(([key, value]) => ({
        label: key.toUpperCase(),
        text: value,
      }))
    : [];

  return (
    <>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <Timer duration={timeLimit * 60} onEnd={handleTimeUp} />

        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 py-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`min-w-[40px] h-10 rounded-full flex items-center justify-center
                  ${
                    selectedOptions[idx] !== null
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }
                  ${currentQuestionIndex === idx ? "ring-2 ring-blue-500" : ""}
                  hover:bg-opacity-80 transition-colors`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>

          {currentQuestion?.image && currentQuestion?.image !== "no_image" && (
            <div className="mb-4">
              <Image
                src={currentQuestion?.image}
                alt={`Question ${currentQuestionIndex + 1}`}
                width={400}
                height={300}
                className="w-full max-w-2xl mx-auto h-auto object-contain rounded"
              />
            </div>
          )}

          <h3 className="text-lg md:text-xl mb-6">
            {currentQuestion?.question}
          </h3>

          <div className="grid gap-4">
            {optionsArray.map((option, optionIdx) => (
              <OptionButton
                key={optionIdx}
                text={`${option.label}. ${option.text}`}
                isSelected={selectedOptions[currentQuestionIndex] === optionIdx}
                onSelect={() => handleSelectOption(optionIdx)}
                className="w-full text-left p-4 rounded-lg hover:bg-gray-50 
                  transition-colors border border-gray-200"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded ${
              currentQuestionIndex === 0
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={() =>
                !isSubmitting && !isSubmitted && handleSubmit("normal")
              }
              disabled={isSubmitting || isSubmitted}
              className={`px-4 py-2 ${
                isSubmitting || isSubmitted ? "bg-gray-400" : "bg-main"
              } text-white rounded`}
            >
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded ${
                currentQuestionIndex === questions.length - 1
                  ? "bg-gray-300"
                  : "bg-main text-white"
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>

      <Dialog open={showWarning} onClose={() => {}} disableEscapeKeyDown>
        <DialogContent>
          <p className="text-lg">{warningMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={requestFullscreen}
            variant="outlined"
            color="primary"
          >
            Return to Full Screen
          </Button>
          <Button
            onClick={handleWarningConfirm}
            variant="contained"
            color="primary"
          >
            Submit Test
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showTimeoutDialog} onClose={() => {}} disableEscapeKeyDown>
        <DialogContent>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Time&apos;s Up!</h2>
            <p className="text-gray-600">
              Your test is being submitted automatically...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showFeedbackModal}
        onClose={() => {}}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <div className="space-y-6 py-4">
            <h2 className="text-2xl font-semibold text-center">
              Test Completed!
            </h2>
            <p className="text-center text-gray-600">
              Please take a moment to provide your feedback
            </p>
            <div className="flex flex-col items-center gap-4">
              <Rating
                value={feedback.rating}
                onChange={(_, newValue) =>
                  setFeedback((prev) => ({
                    ...prev,
                    rating: newValue,
                  }))
                }
                size="large"
              />
              <textarea
                value={feedback.comment}
                onChange={(e) =>
                  setFeedback((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                placeholder="Share your thoughts about the test..."
                className="w-full p-3 border rounded-lg min-h-[100px]"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => router.push(`/mock-test/result/${submittedTestId}`)}
            color="secondary"
          >
            Skip
          </Button>
          <Button
            onClick={handleFeedbackSubmit}
            variant="contained"
            color="primary"
            disabled={!feedback.rating}
          >
            Submit & See Results
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
