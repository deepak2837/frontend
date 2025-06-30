"use client";
import { useState, useEffect } from "react";
import BlogCard from "@/components/Blogs/Cards";
import Link from "next/link";
import LineLoader from "@/components/common/Loader";
import Aside from "@/components/AdSection/Aside";
import TopAdSection from "@/components/AdSection/TopAdSection";
import useGetBlogs from "@/hooks/blog/useGetBlogs";

const COURSE_OPTIONS = ["MBBS", "BDS", "BPT", "NURSING"];
const SUBJECT_OPTIONS = ["PATHOLOGY", "PHYSIOLOGY", "ANATOMY", "BIOCHEMISTRY"];
const DIFFICULTY_OPTIONS = ["beginner", "intermediate", "advanced"];
const TYPE_OPTIONS = ["normal", "news", "exam", "course", "article"];
const CATEGORY_OPTIONS = ["blog", "case-study", "review", "update"];

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    difficulty: "",
  });
  const [sortBy, setSortBy] = useState(""); // trending, featured, or empty
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    difficulties: [],
  });
  const [loadingFilters, setLoadingFilters] = useState(true);

  // Fetch filter options from backend
  useEffect(() => {
    async function fetchFilters() {
      setLoadingFilters(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/blog/filters`);
        const data = await res.json();
        if (data.success) {
          setFilterOptions({
            subjects: data.filters.subjects,
            difficulties: data.filters.difficulties,
          });
        }
      } catch (e) {}
      setLoadingFilters(false);
    }
    fetchFilters();
  }, []);

  // Blog fetch
  const { data, isLoading } = useGetBlogs({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    ...filters,
    sortBy,
  });

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  if (isLoading || loadingFilters) {
    return (
      <div className="flex items-center justify-center lg:mt-[20%] md:mt-[30%] mt-[65%]">
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
      <div className="w-full py-10 text-center mb-8 shadow-lg" style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}>
        <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg font-sans">
          Medgloss Blog
        </h1>
        <p className="text-pink-100 text-lg font-medium">Explore, filter, and discover the best medical blogs!</p>
      </div>

      {/* Filters & Search Bar */}
      <form
        className="w-full max-w-6xl mx-auto px-4 mb-8 flex flex-wrap gap-4 justify-center items-center rounded-xl py-4 shadow-md"
        style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}} 
        onSubmit={handleSearch}
      >
        <div className="flex flex-row gap-2 flex-wrap items-center w-full md:w-auto justify-center">
          <input
            type="text"
            placeholder="Search blogs, tags, or content..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-64 px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold shadow hover:bg-pink-400 transition"
          >
            Search
          </button>
        </div>
        <select
          value={filters.subject}
          onChange={e => handleFilterChange('subject', e.target.value)}
          className="px-3 py-2 rounded-lg border border-pink-200 bg-white text-pink-700 shadow-sm"
        >
          <option value="">Subject</option>
          {filterOptions.subjects.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select
          value={filters.difficulty}
          onChange={e => handleFilterChange('difficulty', e.target.value)}
          className="px-3 py-2 rounded-lg border border-pink-200 bg-white text-pink-700 shadow-sm"
        >
          <option value="">Difficulty</option>
          {filterOptions.difficulties.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <button
          type="button"
          onClick={() => setSortBy(sortBy === 'trending' ? '' : 'trending')}
          className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
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
          className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
            sortBy === 'featured' 
              ? 'bg-pink-500 text-white' 
              : 'bg-white text-pink-700 border border-pink-200 hover:bg-pink-50'
          }`}
        >
          Featured
        </button>
      </form>

      {/* Main content - Full width on mobile */}
      <div className="w-full px-4 py-4 md:max-w-[calc(100%-520px)] md:mx-auto">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-2">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col items-center gap-2 mt-8">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 rounded bg-pink-200 text-pink-700 hover:bg-pink-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {renderPaginationButtons()}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 rounded bg-pink-200 text-pink-700 hover:bg-pink-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                {/* Total number of pages */}
                <div className="text-xs text-pink-700 mt-1">... {pagination.totalPages} pages</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Side Ad Section - Hidden on mobile */}
      <div className="hidden md:block">
        <Aside />
      </div>
      {/* Optional: Bottom Ad Section for mobile only */}
      <div className="block md:hidden">
        <TopAdSection className="mt-8" />
      </div>
    </div>
  );
}
