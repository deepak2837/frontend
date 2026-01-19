"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import NoteCard from "@/components/Notes/NoteCard";
import LineLoader from "@/components/common/Loader";

const NotesClient = ({ initialNotes, initialError }) => {
  const [notes, setNotes] = useState(initialNotes || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Debounced search
  useEffect(() => {
    if (!searchQuery) return;

    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchNotes();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/notes/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setNotes(data.data?.notes || []);
      setError(null);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search notes");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/api/v1/notes/list/published?page=${currentPage}`;
      if (selectedType !== "all") url += `&type=${selectedType}`;
      if (selectedCategory !== "all") url += `&category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();
      setNotes(data.data?.notes || []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedType !== "all" || selectedCategory !== "all") {
      fetchNotes();
    }
  }, [selectedType, selectedCategory, currentPage]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    notes.forEach((note) => {
      if (note.category) uniqueCategories.add(note.category);
    });
    return Array.from(uniqueCategories);
  }, [notes]);

  if (loading && notes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LineLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-primary to-primary/80 rounded-xl md:rounded-2xl mb-6 md:mb-8 overflow-hidden max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="absolute inset-0 bg-pattern opacity-10" aria-hidden="true"></div>
        <div className="relative p-5 md:p-8 lg:p-12 text-white">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-2 md:mb-3 leading-tight">
            Study Notes
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-2xl">
            Comprehensive medical study notes organized by exam, course, and subject
          </p>
        </div>
        <div className="absolute right-0 bottom-0 hidden lg:block" aria-hidden="true">
          <svg width="200" height="120" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="150" r="120" fill="white" fillOpacity="0.1" />
            <circle cx="220" cy="120" r="80" fill="white" fillOpacity="0.1" />
          </svg>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 pb-8">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setSelectedCategory("all");
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="all">All Types</option>
                    <option value="exam">Exam</option>
                    <option value="course">Course</option>
                    <option value="subject">Subject</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    disabled={categories.length === 0}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Notes Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <LineLoader />
              </div>
            ) : notes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No notes found. Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default NotesClient;
