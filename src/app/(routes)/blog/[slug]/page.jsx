"use client";
import { useState } from "react";
import useGetBlogDetails from "@/hooks/blog/useGetBlogDetails";
import LineLoader from "@/components/common/Loader";
import { useParams } from "next/navigation";
import TopAdSection from "@/components/AdSection/TopAdSection";
import Aside from "@/components/AdSection/Aside";

export default function BlogPost() {
  const params = useParams();
  const { data: blog, isLoading, error } = useGetBlogDetails(params?.slug);
  const [isLiked, setIsLiked] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center lg:mt-[20%] md:mt-[30%] mt-[65%]">
        <LineLoader />
      </div>
    );
  }

  if (!blog && !isLoading) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl text-red-500">Blog post not found</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl text-red-500">Error loading blog post</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Ad Section - Hidden on mobile */}
      <div className="hidden md:block">
        <TopAdSection className="sticky top-0 z-50" />
      </div>

      <div className="w-full px-4 py-8 md:max-w-[calc(100%-520px)] md:mx-auto">
        <article className="bg-white rounded-lg shadow-sm p-6">
          {/* Blog Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-center">{blog?.title}</h1>
            <div className="flex gap-4 text-sm text-gray-600 mb-4">
              <span>{new Date(blog?.createdAt).toLocaleDateString()}</span>
              <span>• {blog?.readTime} min read</span>
              <span>• {blog?.viewCount} views</span>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {blog?.type}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {blog?.difficulty}
              </span>
            </div>
          </header>

          {/* Cover Image */}
          {blog?.coverImage && blog.coverImage !== "no_image" && (
            <div className="mb-8">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="prose max-w-none quill-content">
            <div dangerouslySetInnerHTML={{ __html: blog?.content }} />
          </div>

          {/* Blog Footer */}
          <footer className="mt-8 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isLiked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{blog?.likeCount}</span>
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>

      {/* Side Ad Section - Hidden on mobile */}
      <div className="hidden md:block">
        <Aside />
      </div>

      {/* Bottom Ad Section for mobile only */}
      <div className="block md:hidden">
        <TopAdSection className="mt-8" />
      </div>
    </div>
  );
}
