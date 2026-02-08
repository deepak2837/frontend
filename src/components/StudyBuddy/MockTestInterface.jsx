"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiClock, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function MockTestInterface({
  questions,
  testName,
  duration,
  onSubmit,
  onExit
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [mounted, setMounted] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen not supported');
      }
    };

    enterFullscreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
          onSubmit(answers, timeSpent);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answers, onSubmit]);

  const handleSubmit = () => {
    const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
    onSubmit(answers, timeSpent);
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      onExit();
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestion];
  const questionId = currentQ?.questionId || currentQ?._id;
  const isLowTime = timeLeft < 300;
  const answeredCount = Object.keys(answers).length;

  if (!mounted) return null;

  const interfaceContent = (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-50 flex flex-col" style={{ zIndex: 99999 }}>
      {/* Header */}
      <header className="flex-shrink-0 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white shadow-xl">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">{testName}</h1>
                <p className="text-pink-100 text-sm">Q {currentQuestion + 1} / {questions.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${isLowTime ? 'bg-red-500/40 animate-pulse' : 'bg-white/20'}`}>
                <FiClock className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={handleExit}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all"
              >
                <FiX className="w-5 h-5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="flex-shrink-0 bg-white shadow-sm">
        <div className="h-2 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="px-6 py-3 flex justify-between text-sm text-gray-600">
          <span>Answered: {answeredCount} / {questions.length}</span>
          <span>Progress: {Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
      </div>

      {/* Question Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                  Question {currentQuestion + 1}
                </span>
                {currentQ?.difficulty && (
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    currentQ.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {currentQ.difficulty}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                {currentQ?.questionText}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ?.options?.map((option) => {
                const optId = option.optionId || option.id;
                const isSelected = answers[questionId] === optId;
                
                return (
                  <button
                    key={optId}
                    onClick={() => handleAnswerSelect(questionId, optId)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 shadow-md'
                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-700 mr-2">{optId}.</span>
                        <span className="text-gray-900">{option.text}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="px-6 py-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg transition-all"
              >
                <span>Submit Test</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:shadow-lg transition-all"
              >
                <span>Next</span>
                <FiChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );

  return createPortal(interfaceContent, document.body);
}
