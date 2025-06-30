"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function QuestionBankContent({
  groupedByType,
  categoryIcons,
  difficultyColors,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedCategories, setDisplayedCategories] = useState(
    Object.keys(groupedByType)
  );
  const [filteredCategories, setFilteredCategories] = useState(
    Object.keys(groupedByType)
  );

  // Listen for search events from the search component
  useEffect(() => {
    const handleSearch = (e) => {
      setSearchTerm(e.detail);
    };

    window.addEventListener("questionBankSearch", handleSearch);
    return () => {
      window.removeEventListener("questionBankSearch", handleSearch);
    };
  }, []);

  // Update displayed categories when tab changes
  useEffect(() => {
    if (activeTab === "all") {
      setDisplayedCategories(Object.keys(groupedByType));
    } else {
      setDisplayedCategories([activeTab]);
    }
  }, [activeTab, groupedByType]);

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(displayedCategories);
    } else {
      const filtered = displayedCategories.filter((type) => {
        const names = Object.keys(groupedByType[type]);
        return names.some((name) =>
          name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredCategories(filtered);
    }
  }, [searchTerm, displayedCategories, groupedByType]);

  return (
    <>
      {/* Scrollable Tab Navigation for Mobile */}
      <div className="mb-6 md:mb-8 overflow-x-auto pb-2">
        <div className="flex whitespace-nowrap md:flex-wrap md:justify-center bg-white rounded-xl shadow-sm p-1 md:p-1.5 min-w-full">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-primary text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Categories
          </button>
          {Object.keys(groupedByType).map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center ${
                activeTab === type
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Image
                src={categoryIcons[type] || "/api/placeholder/20/20"}
                alt={type}
                width={14}
                height={14}
                className="mr-1 md:mr-1.5"
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}s
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <svg
            className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          <h3 className="text-base md:text-lg font-semibold text-gray-600">
            No results found
          </h3>
          <p className="text-gray-500 mt-1 text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        filteredCategories.map((type) => (
          <div key={type} className="mb-8 md:mb-12">
            <div className="flex items-center mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-2 md:mr-3 shadow-sm">
                <Image
                  src={categoryIcons[type] || "/api/placeholder/32/32"}
                  alt={type}
                  width={18}
                  height={18}
                  className="md:w-5 md:h-5"
                />
              </div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 capitalize">
                {type === "exam"
                  ? "Entrance Exams"
                  : `${type.charAt(0).toUpperCase() + type.slice(1)}s`}
              </h2>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {Object.keys(groupedByType[type])
                .filter(
                  (name) =>
                    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    searchTerm.trim() === ""
                )
                .map((name) => {
                  const banks = groupedByType[type][name];
                  const images = [
                    ...new Set(banks.map((bank) => bank.image).filter(Boolean)),
                  ];
                  const topics = [
                    ...new Set(banks.map((bank) => bank.topic).filter(Boolean)),
                  ];
                  const difficulties = [
                    ...new Set(
                      banks.map((bank) => bank.difficulty).filter(Boolean)
                    ),
                  ];
                  const tags = [
                    ...new Set(banks.map((bank) => bank.tags).filter(Boolean)),
                  ];
                  const category = [
                    ...new Set(
                      banks.map((bank) => bank.category).filter(Boolean)
                    ),
                  ];

                  return (
                    <Link
                      key={name}
                      href={`/question-bank/${type}/${name.toLowerCase()}`}
                      className="group"
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform group-hover:translate-y-[-2px] border border-gray-100 h-full flex flex-col">
                        {/* Card Image */}
                        <div className="relative h-28 sm:h-32 md:h-36 lg:h-52 w-full bg-gray-200 overflow-hidden">
                          {images.length > 0 ? (
                            <Image
                              src={images[0]}
                              alt={name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <Image
                              src={`/api/placeholder/400/300?text=${encodeURIComponent(
                                name
                              )}`}
                              alt={name}
                              fill
                              className="object-cover"
                            />
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                          {/* Category badge */}
                          <div className="absolute top-2 left-2 lg:top-3 lg:left-3">
                            <span className="inline-flex items-center bg-primary/90 text-white text-xs px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-md uppercase font-medium">
                              <svg
                                className="w-2.5 h-2.5 mr-1 lg:w-3 lg:h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              {type}
                            </span>
                          </div>

                          {/* Difficulty badge */}
                          {difficulties.length > 0 && (
                            <div className="absolute top-2 right-2 lg:top-3 lg:right-3">
                              <span
                                className={`text-xs px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-md font-medium ${
                                  difficultyColors[
                                    difficulties[0]?.toLowerCase()
                                  ] ||
                                  "bg-gray-100 text-gray-800 ring-1 ring-gray-200"
                                }`}
                              >
                                {difficulties[0]}
                              </span>
                            </div>
                          )}

                          {/* Tags */}
                          {(topics.length > 0 ||
                            tags.length > 0 ||
                            category.length > 0) && (
                            <div className="absolute bottom-1 left-1 right-1 lg:bottom-2 lg:left-2 lg:right-2 flex flex-wrap gap-1 lg:gap-1.5">
                              {[...topics, ...tags, ...category]
                                .slice(0, 2)
                                .map((item) => (
                                  <span
                                    key={item}
                                    className="text-xs bg-black/40 text-white px-1.5 py-0.5 lg:px-2 lg:py-0.5 rounded-sm truncate"
                                  >
                                    {item}
                                  </span>
                                ))}
                              {[...topics, ...tags, ...category].length > 2 && (
                                <span className="text-xs bg-primary/80 text-white font-medium px-1.5 py-0.5 lg:px-2 lg:py-0.5 rounded-sm">
                                  +
                                  {[...topics, ...tags, ...category].length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-3 lg:p-5 flex-grow">
                          <div className="flex items-center justify-between mb-2 lg:mb-3">
                            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                              {name}
                            </h3>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center">
                              <div className="bg-purple-100 p-1 lg:p-1.5 rounded-md mr-1.5 lg:mr-2">
                                <svg
                                  className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-purple-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  ></path>
                                </svg>
                              </div>
                              <div>
                                <div className="text-xs lg:text-sm text-gray-500">
                                  Sub-banks
                                </div>
                                <div className="font-semibold">
                                  {banks.length}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-3 py-2 lg:px-5 lg:py-3 border-t border-gray-100 flex justify-between items-center">
                          <div className="text-primary text-xs lg:text-sm font-semibold">
                            <span className="hidden lg:inline">
                              Explore Bank
                            </span>
                            <span className="lg:hidden">Explore</span>
                          </div>
                          <div className="bg-primary/10 p-1 lg:p-1.5 rounded-full transform group-hover:translate-x-1 transition-all duration-300">
                            <svg
                              className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>

            {Object.keys(groupedByType[type]).filter(
              (name) =>
                name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                searchTerm.trim() === ""
            ).length === 0 && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm">
                  No matching {type}s found for {searchTerm}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </>
  );
}
