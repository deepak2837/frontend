import React from 'react';
import Headings from '@/components/Headings/Headings.jsx';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { FaGraduationCap } from 'react-icons/fa';

const PredictorSection = () => {
  return (
    <div className="container py-8">
      <Headings
        title="College/Rank Predictor"
        text="Predict your rank and find the best colleges based on your NEET scores"
      />

      <div className="flex justify-center">
        <a
          href="/predictors"
          className="w-[90%] md:w-[45%] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-b-4 border-[#e48551] bg-gradient-to-r from-blue-500 to-cyan-600 no-underline"
          style={{ borderRadius: '45px' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 w-full space-y-2">
              <div className="text-white text-xl font-semibold">
                <span className="block">College/Rank</span>
                <span className="block">Predictor</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-white">
                <BsFillArrowUpRightCircleFill /> Learn more
              </div>
            </div>
            <div className="text-white">
              <FaGraduationCap className="text-6xl" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default PredictorSection;
