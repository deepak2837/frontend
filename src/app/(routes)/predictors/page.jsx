"use client";
import React from 'react';
import { FaGraduationCap, FaTrophy } from 'react-icons/fa';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

const PredictorsPage = () => {
  const predictors = [
    {
      title: "NEET PG Rank Predictor",
      description: "Predict your NEET PG rank",
      icon: <FaTrophy className="text-5xl" />,
      link: "#",
      comingSoon: true,
    },
    {
      title: "NEET UG College Predictor",
      description: "Find colleges by your rank",
      icon: <FaGraduationCap className="text-5xl" />,
      link: "/neet-ug-predictor",
      comingSoon: false,
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">College & Rank Predictors</h1>
        <p className="text-gray-600 text-lg">
          Choose a predictor tool to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {predictors.map((predictor, index) => (
          <a
            key={index}
            href={predictor.comingSoon ? "#" : predictor.link}
            className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-b-4 border-[#e48551] no-underline relative ${
              index % 2 === 0
                ? 'bg-gradient-to-r from-pink-500 via-yellow-500 to-orange-500'
                : 'bg-white'
            } ${predictor.comingSoon ? 'pointer-events-none opacity-75' : ''}`}
            style={{ borderRadius: '45px' }}
          >
            {predictor.comingSoon && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                Coming Soon
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className={`text-xl font-bold ${index % 2 === 0 ? 'text-black' : 'text-black'}`}>
                  {predictor.title}
                </h2>
                <p className={`text-sm ${index % 2 === 0 ? 'text-white' : 'text-gray-600'}`}>
                  {predictor.description}
                </p>
                {!predictor.comingSoon && (
                  <div className={`flex items-center gap-2 font-medium ${index % 2 === 0 ? 'text-white' : 'text-black'}`}>
                    <BsFillArrowUpRightCircleFill /> Learn more
                  </div>
                )}
              </div>
              <div className={index % 2 === 0 ? 'text-white' : 'text-gray-700'}>
                {predictor.icon}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default PredictorsPage;
