"use client";
import { useState, useEffect } from "react";
import BlogCard from "@/components/Blogs/Cards";
import Link from "next/link";
import LineLoader from "@/components/common/Loader";
// import Aside from "@/components/AdSection/Aside";
import TopAdSection from "@/components/AdSection/TopAdSection";
import useGetBlogs from "@/hooks/blog/useGetBlogs";
import MedglossLogo from "@/components/common/Medgloss";
import Image from "next/image";

// Predefined filter options - matching actual database subjects
const SUBJECT_OPTIONS = [
  "AETCOM",
  "Anaesthesiology",
  "Biochemistry",
  "Community Medicine",
  "Dentistry",
  "Dermatology, Venereology and Leprosy",
  "Forensic Medicine Including Toxicology",
  "General Medicine",
  "General Surgery",
  "Human Anatomy",
  "Microbiology",
  "Neurology",
  "Obstetrics & Gynecology",
  "Ophthalmology",
  "Orthopaedics",
  "Otorhinolaryngology (ENT)",
  "Pathology",
  "Pediatrics",
  "Pharmacology",
  "Physical Medicine & Rehabilitation",
  "Physiology",
  "Psychiatry",
  "Radiodiagnosis",
  "Radiotherapy",
  "Respiratory Medicine",
  "Surgery",
  "Test"
];

const DIFFICULTY_OPTIONS = ["beginner", "intermediate", "advanced"];

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    difficulty: "",
  });
  const [sortBy, setSortBy] = useState(""); // trending, featured, or empty

  // Blog fetch
  const { data, isLoading } = useGetBlogs({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    ...filters,
    sortBy,
  });

  // Debug current filters
  console.log('Current filters:', { searchQuery, filters, sortBy });

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    console.log(`Filter changed: ${key} = ${value}`);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LineLoader />
      </div>
    );
  }

  const posts = data?.data || [];
  const pagination = data?.pagination || {};

  const renderPaginationButtons = () => {
    const buttons = [];
    const totalPages = pagination.totalPages;
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === i
              ? "bg-main text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Theme Gradient Header */}
      <div className="w-full flex justify-center mt-6 mb-10">
        <div className="relative w-full max-w-7xl mx-auto px-4 py-4 rounded-3xl shadow-2xl bg-gradient-to-br from-pink-400/80 via-orange-200/60 to-pink-100/80 border-2 border-pink-200/60 backdrop-blur-md overflow-hidden flex flex-col items-center">
          {/* Logo and Blog title group */}
          <div className="flex flex-col items-center mb-2 z-10">
            <div className="flex items-center gap-3">
              <span className="inline-block align-middle">
                <MedglossLogo width={56} height={56} />
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-pink-100 to-orange-200 bg-clip-text text-transparent drop-shadow-xl font-sans">
                Blogs
              </span>
            </div>
          </div>
          {/* Animated sparkles */}
          <div className="absolute inset-0 pointer-events-none animate-pulse-slow">
            <svg width="100%" height="100%" className="absolute left-0 top-0 opacity-30" style={{zIndex:0}}>
              <circle cx="10%" cy="20%" r="18" fill="#fff6" />
              <circle cx="80%" cy="30%" r="10" fill="#fff3" />
              <circle cx="60%" cy="80%" r="14" fill="#fff2" />
            </svg>
          </div>
          <p className="text-pink-900 text-xl sm:text-2xl font-semibold mb-2 z-10">
            Your Gateway to Medical Mastery
          </p>
          <p className="text-pink-700 text-base sm:text-lg font-medium mb-4 z-10">
            Discover, learn, and stay ahead with the latest in medicine.<br className="hidden sm:inline" />
            <span className="font-bold text-orange-600">Curated by experts. Loved by learners.</span>
          </p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <form
        className="w-full max-w-7xl mx-auto px-4 mb-8 flex flex-wrap gap-3 sm:gap-4 justify-center items-center rounded-xl py-4 shadow-md"
        style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}} 
        onSubmit={handleSearch}
      >
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap items-center w-full justify-center">
          <input
            type="text"
            placeholder="Search blogs, tags, or content..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-sm"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold shadow hover:bg-pink-400 transition"
          >
            Search
          </button>
        </div>
        <select
          value={filters.subject}
          onChange={e => handleFilterChange('subject', e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-lg border border-pink-200 bg-white text-pink-700 shadow-sm"
        >
          <option value="">Subject</option>
          {SUBJECT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select
          value={filters.difficulty}
          onChange={e => handleFilterChange('difficulty', e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-lg border border-pink-200 bg-white text-pink-700 shadow-sm"
        >
          <option value="">Difficulty</option>
          {DIFFICULTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <button
          type="button"
          onClick={() => setSortBy(sortBy === 'trending' ? '' : 'trending')}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold shadow transition ${
            sortBy === 'trending' 
              ? 'bg-pink-500 text-white' 
              : 'bg-white text-pink-700 border border-pink-200 hover:bg-pink-50'
          }`}
        >
          Trending
        </button>
        <button
          type="button"
          onClick={() => setSortBy(sortBy === 'featured' ? '' : 'featured')}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold shadow transition ${
            sortBy === 'featured' 
              ? 'bg-pink-500 text-white' 
              : 'bg-white text-pink-700 border border-pink-200 hover:bg-pink-50'
          }`}
        >
          Featured
        </button>
      </form>

      {/* Main content - Responsive layout */}
      <div className="w-full max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-2">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col items-center gap-2 mt-8 w-full">
                <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 rounded bg-pink-200 text-pink-700 hover:bg-pink-300 disabled:opacity-50 w-full sm:w-auto"
                  >
                    Previous
                  </button>
                  <div className="flex flex-row flex-wrap justify-center items-center gap-2">
                    {renderPaginationButtons()}
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 rounded bg-pink-200 text-pink-700 hover:bg-pink-300 disabled:opacity-50 w-full sm:w-auto"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Side Ad Section - Hidden on mobile */}
      {/* <div className="hidden md:block">
        <Aside />
      </div> */}
      {/* Optional: Bottom Ad Section for mobile only */}
      {/* <div className="block md:hidden">
        <TopAdSection className="mt-8" />
      </div> */}
    </div>
  );
}
