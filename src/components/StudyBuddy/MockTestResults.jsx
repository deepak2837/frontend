"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiCheck, FiX, FiClock, FiAward } from 'react-icons/fi';

export default function MockTestResults({
  testName,
  results,
  timeSpent,
  totalTime,
  onClose,
  onRetakeTest
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const correctCount = results.filter(r => r.isCorrect).length;
  const wrongCount = results.filter(r => !r.isCorrect && r.userAnswer).length;
  const unansweredCount = results.filter(r => !r.userAnswer).length;
  const totalQuestions = results.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= 60;

  const wrongAnswers = results.filter(r => !r.isCorrect && r.userAnswer);
  const unansweredQuestions = results.filter(r => !r.userAnswer);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!mounted) return null;

  const resultsContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto" style={{ zIndex: 99999 }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-8 text-white ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}`}>
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {passed ? <FiAward className="w-10 h-10" /> : <FiX className="w-10 h-10" />}
            </div>
            <h2 className="text-3xl font-bold mb-2">{passed ? 'Congratulations!' : 'Keep Practicing!'}</h2>
            <p className="text-white/90">{testName}</p>
          </div>
        </div>

        {/* Score Summary */}
        <div className="p-8 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{percentage}%</div>
              <div className="text-sm text-gray-600 mt-1">Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600 mt-1">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{wrongCount}</div>
              <div className="text-sm text-gray-600 mt-1">Wrong</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{unansweredCount}</div>
              <div className="text-sm text-gray-600 mt-1">Unanswered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{formatTime(timeSpent)}</div>
              <div className="text-sm text-gray-600 mt-1">Time Taken</div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="p-8">
          {/* Wrong Answers Section */}
          {wrongAnswers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                <FiX className="w-6 h-6 mr-2" />
                Wrong Answers ({wrongAnswers.length})
              </h3>
              <div className="space-y-4">
                {wrongAnswers.map((result, index) => {
                  const questionIndex = results.findIndex(r => r.questionId === result.questionId);
                  return (
                    <div
                      key={result.questionId}
                      className="p-4 rounded-xl border-2 border-red-200 bg-red-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500">
                            <FiX className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-700">Question {questionIndex + 1}</span>
                        </div>
                      </div>

                      <p className="text-gray-900 mb-3 font-medium">{result.question.questionText}</p>

                      <div className="space-y-2">
                        {result.question.options?.map((option) => {
                          const optId = option.optionId || option.id;
                          const isUserAnswer = result.userAnswer === optId;
                          const isCorrectAnswer = result.correctAnswer === optId;

                          return (
                            <div
                              key={optId}
                              className={`p-3 rounded-lg ${
                                isCorrectAnswer ? 'bg-green-100 border-2 border-green-500' :
                                isUserAnswer ? 'bg-red-100 border-2 border-red-500' :
                                'bg-white border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {isCorrectAnswer && <FiCheck className="w-4 h-4 text-green-600" />}
                                {isUserAnswer && !isCorrectAnswer && <FiX className="w-4 h-4 text-red-600" />}
                                <span className="font-semibold">{optId}.</span>
                                <span>{option.text}</span>
                                {isUserAnswer && <span className="ml-2 text-xs text-red-600">(Your answer)</span>}
                                {isCorrectAnswer && <span className="ml-2 text-xs text-green-600">(Correct answer)</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {result.question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-900">
                            <strong>Explanation:</strong> {result.question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Unanswered Questions Section */}
          {unansweredQuestions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center">
                <span className="text-2xl mr-2">⚠️</span>
                Unanswered Questions ({unansweredQuestions.length})
              </h3>
              <div className="space-y-4">
                {unansweredQuestions.map((result, index) => {
                  const questionIndex = results.findIndex(r => r.questionId === result.questionId);
                  return (
                    <div
                      key={result.questionId}
                      className="p-4 rounded-xl border-2 border-orange-200 bg-orange-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-500 text-white">
                            ?
                          </div>
                          <span className="font-semibold text-gray-700">Question {questionIndex + 1}</span>
                        </div>
                      </div>

                      <p className="text-gray-900 mb-3 font-medium">{result.question.questionText}</p>

                      <div className="space-y-2">
                        {result.question.options?.map((option) => {
                          const optId = option.optionId || option.id;
                          const isCorrectAnswer = result.correctAnswer === optId;

                          return (
                            <div
                              key={optId}
                              className={`p-3 rounded-lg ${
                                isCorrectAnswer ? 'bg-green-100 border-2 border-green-500' :
                                'bg-white border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {isCorrectAnswer && <FiCheck className="w-4 h-4 text-green-600" />}
                                <span className="font-semibold">{optId}.</span>
                                <span>{option.text}</span>
                                {isCorrectAnswer && <span className="ml-2 text-xs text-green-600">(Correct answer)</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {result.question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-900">
                            <strong>Explanation:</strong> {result.question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-8 border-t border-gray-200 flex justify-center space-x-4">
          <button
            onClick={onRetakeTest}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:shadow-lg transition-all"
          >
            Retake Test
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(resultsContent, document.body);
}
