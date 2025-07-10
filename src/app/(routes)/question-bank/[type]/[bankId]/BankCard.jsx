// app/question-bank/[type]/[bankId]/BankCard.jsx
"use client";

import React, { useMemo } from "react";
import Link from "next/link";

// List of Emojis
const emojiList = [
  "🤩",
  "😷",
  "👨‍⚕️",
  "🥼",
  "🏥",
  "💊",
  "🩺",
  "💉",
  "💚",
  "🩵",
  "❤️‍🩹",
  "🧚‍♂️",
  "👼",
  "💪",
  "⚡",
  "💡",
];

// Helper: Render Image (Responsive)
const renderBankImage = (imageData) => {
  const isBase64 = (str) => {
    if (typeof str !== "string") return false;
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const placeholderSvg = (
    <svg
      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-300"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z"
        clipRule="evenodd"
      />
      <path d="M8.5 7a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
      <path
        fillRule="evenodd"
        d="M6.5 12h7a.5.5 0 00.4-.8l-1.5-2a.5.5 0 00-.8 0L10 11l-1.2-1.6a.5.5 0 00-.8 0l-2 2.6a.5.5 0 00.4.8h.1z"
        clipRule="evenodd"
      />
    </svg>
  );

  const placeholderDiv = (
    <div className="h-full w-full bg-gray-100 rounded-t-xl flex items-center justify-center">
      {placeholderSvg}
    </div>
  );

  if (!imageData || imageData === "no_image") {
    return placeholderDiv;
  }

  const src = isBase64(imageData)
    ? `data:image/jpeg;base64,${imageData}`
    : imageData;

  return (
    <img
      src={src}
      alt="Question Bank"
      className="w-full h-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-110"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/placeholder-image.png";
        e.currentTarget.parentElement.classList.add("bg-gray-100");
      }}
      loading="lazy"
    />
  );
};

function getDeterministicEmoji(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return emojiList[Math.abs(hash) % emojiList.length];
}

export default function BankCard({ bank, typeParam }) {
  const emoji = getDeterministicEmoji(bank._id || bank.title || "");

  return (
    <Link
      href={`/question-bank/${typeParam}/${bank.name}/${bank.title
        .toLowerCase()
        .replace(/\s+/g, "-")}/${bank._id}`}
      className="group block h-full"
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col transform transition-transform hover:translate-y-[-2px] max-w-xs sm:max-w-sm md:max-w-md mx-auto min-h-[180px] sm:min-h-[200px] md:min-h-[220px]">
        {/* Image Area */}
        <div className="relative">
          <div className="h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 w-full overflow-hidden">
            {renderBankImage(bank.image)}
          </div>

          {/* Questions count badge */}
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white/90 text-primary rounded-full px-1.5 py-0.5 text-xs sm:text-sm font-medium shadow-sm">
            {bank.totalQuestions || 0} Questions
          </div>

          {/* Recommended badge */}
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex items-center bg-white/90 rounded-full px-1.5 py-0.5 text-xs sm:text-sm font-medium shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="ml-0.5 sm:ml-1 text-gray-700 text-xs">
              Recommended
            </span>
          </div>

          {/* Status and Views */}
          <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 flex items-center gap-1 sm:gap-2">
            {bank.status && bank.status !== "draft" && (
              <span
                className={`font-medium capitalize px-1 py-0.5 sm:px-1.5 sm:py-0.5 lg:px-2 lg:py-1 rounded text-xs ${
                  bank.status === "live"
                    ? "text-green-700 bg-green-100/90"
                    : "text-yellow-700 bg-yellow-100/90"
                }`}
              >
                {bank.status}
              </span>
            )}
            {bank.views !== undefined && (
              <span className="flex items-center gap-0.5 bg-white/80 rounded-full px-1.5 py-0.5 text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs">{bank.views}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-1 sm:p-2 md:p-2.5 lg:p-3 flex-grow flex flex-col">
          {/* Title and Subject */}
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 mb-0.5 sm:mb-1 lg:mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {bank.title}
          </h3>
          {/* Topic Badge and Emoji */}
          <div className="mb-0.5 sm:mb-1 flex items-center gap-0.5 lg:gap-1">
            <span className="inline-block bg-primary/10 text-primary text-xs font-medium rounded-full px-1.5 py-0.5 sm:px-2 lg:px-3 lg:py-1">
              {bank.topic || bank.category || "General"}
            </span>
            <span className="inline-block bg-primary/10 text-primary text-xs font-medium rounded-full px-1.5 py-0.5 sm:px-2 lg:px-3 lg:py-1">
              {bank.name}
            </span>
            <span
              role="img"
              aria-label="Decorative Emoji"
              className="text-sm lg:text-lg"
            >
              {emoji}
            </span>
          </div>

          {/* Footer / Actions */}
          <div className="mt-auto pt-0.5 sm:pt-1 lg:pt-1.5 border-t border-gray-100 flex justify-end items-center">
            {/* View Bank Button */}
            <button className="px-1.5 sm:px-2 lg:px-2.5 py-0.5 sm:py-0.5 lg:py-1 bg-primary text-white rounded text-xs sm:text-xs hover:bg-primary/90 transition-all">
              View Bank
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
