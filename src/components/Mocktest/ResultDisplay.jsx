"use client";
import React from "react";
import useAuthStore from "@/store/authStore";

const WelcomeCard = ({ username }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Welcome, {username}!
    </h2>
    <p className="text-gray-600 mt-2">Here are your test results</p>
  </div>
);

const TestHeaderCard = ({ result }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center p-3">
        <p className="font-semibold text-gray-600">Test Date & Time</p>
        <p className="text-lg">
          {new Date(result.createdAt).toLocaleString()}
        </p>
      </div>
    
      <div className="text-center p-3">
        <p className="font-semibold text-gray-600">Attempt ID</p>
        <p className="text-lg">{result.attemptId}</p>
      </div>
    </div>
  </div>
);

const ResultSummaryCard = ({ result }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4">Test Summary</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="text-center p-3 bg-gray-50 rounded">
        <p className="font-semibold">Total Questions</p>
        <p className="text-xl">{result.totalQuestions}</p>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded">
        <p className="font-semibold">Attempted</p>
        <p className="text-xl">{result.attemptedQuestions}</p>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded">
        <p className="font-semibold">Not Attempted</p>
        <p className="text-xl">{result.totalQuestions-result.attemptedQuestions}</p>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded">
        <p className="font-semibold">Score</p>
        <p className="text-xl">{result.score.toFixed(2)}%</p>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded">
        <p className="font-semibold">Correct Answers</p>
        <p className="text-xl text-green-600">{result.correctAnswers}</p>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded">
        <p className="font-semibold">Incorrect Answers</p>
        <p className="text-xl text-red-600">{result.incorrectAnswers}</p>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded">
        <p className="font-semibold">Rank</p>
        <p className="text-xl">{result.rank}</p>
      </div>
    </div>
  </div>
);

const IncorrectAnswersCard = ({ incorrectAnswers }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4">Incorrect Answers Analysis</h2>
    <div className="space-y-4">
      {incorrectAnswers.map((answer, index) => (
        <div key={index} className="border-b pb-4">
          <p className="font-semibold mb-2">Question {index + 1}</p>
          <p className="mb-2 text-gray-700">{answer.questionText}</p>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <span className="font-medium">Correct Answer:</span>
              <span className="ml-2 text-green-600">{answer.correctAnswer}</span>
            </div>
            <div>
              <span className="font-medium">Your Answer:</span>
              <span className="ml-2 text-red-600">{answer.userAnswer || 'Not attempted'}</span>
            </div>
          </div>
          <p className="mt-2 text-gray-600">
            <span className="font-medium">Explanation:</span>
            <span className="ml-2">{answer.explanation}</span>
          </p>
        </div>
      ))}
    </div>
  </div>
);

const SubjectWiseTable = ({ subjectWiseAnalysis }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Subject</th>
            <th className="py-2 px-4 border">Total Questions</th>
            <th className="py-2 px-4 border">Attempted</th>
            <th className="py-2 px-4 border">Not Attempted</th>
            <th className="py-2 px-4 border">Correct</th>
            <th className="py-2 px-4 border">Incorrect</th>
            <th className="py-2 px-4 border">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {subjectWiseAnalysis.map((subject, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{subject.subject}</td>
              <td className="py-2 px-4 border text-center">{subject.totalQuestions}</td>
              <td className="py-2 px-4 border text-center">{subject.attempted}</td>
              <td className="py-2 px-4 border text-center">{subject.totalQuestions - subject.attempted}</td>
              <td className="py-2 px-4 border text-center">{subject.correct}</td>
              <td className="py-2 px-4 border text-center">{subject.incorrect}</td>
              <td className="py-2 px-4 border text-center">{subject.accuracy}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ResultDisplay = ({ result }) => {
  const { getUser } = useAuthStore();
  const user = getUser();
  const username = user?.name || 'User';

  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeCard username={username} />
      <TestHeaderCard result={result} />
      <ResultSummaryCard result={result} />
      <SubjectWiseTable subjectWiseAnalysis={result.subjectWiseAnalysis} />
      <IncorrectAnswersCard incorrectAnswers={result.incorrectAnswersDetails} />
    </div>
  );
};

export default ResultDisplay;
