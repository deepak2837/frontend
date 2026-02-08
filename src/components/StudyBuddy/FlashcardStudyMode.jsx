"use client";
import React, { useState, useEffect } from 'react';
import FlipFlashcard from './FlipFlashcard';
import { FiChevronLeft, FiChevronRight, FiRotateCw } from 'react-icons/fi';

export default function FlashcardStudyMode({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studied, setStudied] = useState(new Set());

  const currentCard = flashcards[currentIndex];
  const progress = Math.round(((currentIndex + 1) / flashcards.length) * 100);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setStudied(prev => new Set([...prev, currentIndex]));
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudied(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Flashcard {currentIndex + 1} of {flashcards.length}
        </h3>
        <p className="text-gray-600">
          {studied.size} studied • {flashcards.length - studied.size} remaining
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-pink-500 to-fuchsia-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      <div onClick={() => setIsFlipped(!isFlipped)}>
        <FlipFlashcard flashcard={currentCard} isFlipped={isFlipped} />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FiChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition-all"
        >
          <FiRotateCw className="w-5 h-5" />
          <span>Reset</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span>Next</span>
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>💡 Keyboard shortcuts:</p>
        <p>← Previous • → Next • Space Flip card</p>
      </div>

      {/* Completion Message */}
      {currentIndex === flashcards.length - 1 && studied.size === flashcards.length - 1 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-lg font-bold text-green-900 mb-2">Great job!</p>
          <p className="text-green-700">You've studied all {flashcards.length} flashcards</p>
          <button
            onClick={handleReset}
            className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
          >
            Study Again
          </button>
        </div>
      )}
    </div>
  );
}
