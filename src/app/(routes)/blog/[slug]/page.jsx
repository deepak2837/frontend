"use client";
import { useState, useEffect } from "react";
import useGetBlogDetails from "@/hooks/blog/useGetBlogDetails";
import LineLoader from "@/components/common/Loader";
import { useParams } from "next/navigation";
import TopAdSection from "@/components/AdSection/TopAdSection";
import Aside from "@/components/AdSection/Aside";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Head from "next/head";

export default function BlogPost() {
  const params = useParams();
  const { data: blog, isLoading, error } = useGetBlogDetails(params?.slug);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  // Set document title and meta tags when blog data is loaded
  useEffect(() => {
    if (blog?.seo) {
      // Set document title
      document.title = blog.seo.metaTitle || blog.title;
      
      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', blog.seo.metaDescription || blog.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = blog.seo.metaDescription || blog.description;
        document.head.appendChild(meta);
      }

      // Set meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', blog.seo.metaKeywords?.join(', ') || blog.tags?.join(', '));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = blog.seo.metaKeywords?.join(', ') || blog.tags?.join(', ');
        document.head.appendChild(meta);
      }

      // Set canonical URL
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', blog.seo.canonicalURL || `${window.location.origin}${window.location.pathname}`);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = blog.seo.canonicalURL || `${window.location.origin}${window.location.pathname}`;
        document.head.appendChild(link);
      }

      // Set Open Graph meta tags
      const ogTags = [
        { property: 'og:title', content: blog.seo.metaTitle || blog.title },
        { property: 'og:description', content: blog.seo.metaDescription || blog.description },
        { property: 'og:image', content: blog.seo.ogImage || blog.coverImage },
        { property: 'og:url', content: blog.seo.canonicalURL || `${window.location.origin}${window.location.pathname}` },
        { property: 'og:type', content: 'article' },
        { property: 'og:site_name', content: 'Your Site Name' }, // Replace with your site name
        { property: 'article:author', content: 'Your Author Name' }, // Replace with author info
        { property: 'article:published_time', content: blog.publishedAt },
        { property: 'article:modified_time', content: blog.updatedAt },
        { property: 'article:section', content: blog.subject || blog.category },
        { property: 'article:tag', content: blog.tags?.join(', ') }
      ];

      ogTags.forEach(tag => {
        const existingTag = document.querySelector(`meta[property="${tag.property}"]`);
        if (existingTag) {
          existingTag.setAttribute('content', tag.content);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', tag.property);
          meta.content = tag.content;
          document.head.appendChild(meta);
        }
      });

      // Set Twitter Card meta tags
      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: blog.seo.metaTitle || blog.title },
        { name: 'twitter:description', content: blog.seo.metaDescription || blog.description },
        { name: 'twitter:image', content: blog.seo.ogImage || blog.coverImage },
        { name: 'twitter:site', content: '@yourhandle' }, // Replace with your Twitter handle
        { name: 'twitter:creator', content: '@yourhandle' } // Replace with author's Twitter handle
      ];

      twitterTags.forEach(tag => {
        const existingTag = document.querySelector(`meta[name="${tag.name}"]`);
        if (existingTag) {
          existingTag.setAttribute('content', tag.content);
        } else {
          const meta = document.createElement('meta');
          meta.name = tag.name;
          meta.content = tag.content;
          document.head.appendChild(meta);
        }
      });

      // Set additional SEO meta tags
      const additionalTags = [
        { name: 'author', content: 'Your Author Name' }, // Replace with author info
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'bingbot', content: 'index, follow' },
        { name: 'subject', content: blog.subject || blog.category },
        { name: 'topic', content: blog.seo.topic || blog.title },
        { name: 'summary', content: blog.summary },
        { name: 'category', content: blog.category },
        { name: 'coverage', content: 'Worldwide' },
        { name: 'distribution', content: 'Global' },
        { name: 'rating', content: 'General' },
        { name: 'revisit-after', content: '7 days' }
      ];

      additionalTags.forEach(tag => {
        const existingTag = document.querySelector(`meta[name="${tag.name}"]`);
        if (existingTag) {
          existingTag.setAttribute('content', tag.content);
        } else {
          const meta = document.createElement('meta');
          meta.name = tag.name;
          meta.content = tag.content;
          document.head.appendChild(meta);
        }
      });

      // Add JSON-LD structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": blog.seo.schemaType || "Article",
        "headline": blog.seo.metaTitle || blog.title,
        "description": blog.seo.metaDescription || blog.description,
        "image": blog.seo.ogImage || blog.coverImage,
        "author": {
          "@type": "Person",
          "name": "Your Author Name" // Replace with actual author info
        },
        "publisher": {
          "@type": "Organization",
          "name": "Your Site Name", // Replace with your site name
          "logo": {
            "@type": "ImageObject",
            "url": "https://yoursite.com/logo.png" // Replace with your logo URL
          }
        },
        "datePublished": blog.publishedAt,
        "dateModified": blog.updatedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": blog.seo.canonicalURL || `${window.location.origin}${window.location.pathname}`
        },
        "wordCount": blog.wordCount,
        "timeRequired": `PT${blog.readingTime || blog.seo.readingTime}M`,
        "keywords": blog.seo.metaKeywords?.join(', ') || blog.tags?.join(', '),
        "articleSection": blog.subject || blog.category,
        "about": {
          "@type": "Thing",
          "name": blog.seo.topic || blog.title
        }
      };

      // Add additional medical schema if it's a medical page
      if (blog.seo.schemaType === "MedicalWebPage") {
        structuredData["@type"] = "MedicalWebPage";
        structuredData.medicalAudience = {
          "@type": "MedicalAudience",
          "audienceType": "Student"
        };
        structuredData.about = {
          "@type": "MedicalCondition",
          "name": blog.seo.topic || blog.title
        };
      }

      // Remove existing JSON-LD script if present
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new JSON-LD script
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [blog]);

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
    <>
      {/* Next.js Head component for additional SEO (if using pages router) */}
      <Head>
        <title>{blog?.seo?.metaTitle || blog?.title}</title>
        <meta name="description" content={blog?.seo?.metaDescription || blog?.description} />
        <meta name="keywords" content={blog?.seo?.metaKeywords?.join(', ') || blog?.tags?.join(', ')} />
        <link rel="canonical" href={blog?.seo?.canonicalURL || `${typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={blog?.seo?.metaTitle || blog?.title} />
        <meta property="og:description" content={blog?.seo?.metaDescription || blog?.description} />
        <meta property="og:image" content={blog?.seo?.ogImage || blog?.coverImage} />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog?.seo?.metaTitle || blog?.title} />
        <meta name="twitter:description" content={blog?.seo?.metaDescription || blog?.description} />
        <meta name="twitter:image" content={blog?.seo?.ogImage || blog?.coverImage} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Top Ad Section - Hidden on mobile */}
        <div className="hidden md:block">
          <TopAdSection className="sticky top-0 z-50" />
        </div>

        <div className="w-full px-0 sm:px-4 py-4 lg:max-w-[calc(100%-520px)] lg:mx-auto">
          <article className="bg-white rounded-lg shadow-sm p-6">
            {/* Blog Header */}
            <header className="mb-8">
              <button
                onClick={() => router.back()}
                style={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}
                className="mb-2 px-4 py-1.5 text-sm rounded flex items-center gap-1 font-medium text-white shadow hover:opacity-90 transition"
                aria-label="Go back"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              
              {/* SEO optimized heading structure */}
              <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center truncate">
                {blog?.title}
              </h1>
              
              {/* Subtitle for additional SEO context */}
              {blog?.subtitle && (
                <h2 className="text-lg sm:text-xl text-gray-600 mb-4 text-center">
                  {blog.subtitle}
                </h2>
              )}
              
              {/* Summary for SEO */}
              {blog?.summary && (
                <p className="text-gray-700 mb-4 text-center max-w-3xl mx-auto">
                  {blog.summary}
                </p>
              )}
              
              <div className="flex gap-4 text-sm text-gray-600 mb-4 justify-center">
                <span>{new Date(blog?.createdAt || blog?.publishedAt).toLocaleDateString()}</span>
                <span>• {blog?.readingTime || blog?.seo?.readingTime} min read</span>
                <span>• {blog?.viewCount} views</span>
              </div>
              
              <div className="flex gap-2 justify-center flex-wrap">
                {blog?.type && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {blog.type}
                  </span>
                )}
                {blog?.difficulty && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {blog.difficulty}
                  </span>
                )}
                {blog?.subject && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {blog.subject}
                  </span>
                )}
              </div>
            </header>

            {/* Cover Image with SEO alt text */}
            {blog?.coverImage && blog.coverImage !== "no_image" && (
              <div className="mb-8">
                <Image
                  src={blog.coverImage}
                  alt={blog.seo?.metaTitle || blog.title}
                  width={800}
                  height={400}
                  className="w-full max-h-[200px] sm:max-h-[300px] md:max-h-[400px] object-cover rounded-lg mx-auto"
                  style={{ width: "100%", height: "auto" }}
                  priority
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="prose max-w-none quill-content">
              <div dangerouslySetInnerHTML={{ __html: blog?.content }} />
            </div>

            {/* Tags for SEO */}
            {blog?.tags && blog.tags.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                    aria-label={`${isLiked ? 'Unlike' : 'Like'} this post`}
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
                
                {/* Social sharing buttons for additional SEO signals */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: blog?.seo?.metaTitle || blog?.title,
                          text: blog?.seo?.metaDescription || blog?.description,
                          url: window.location.href
                        });
                      }
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition"
                    aria-label="Share this post"
                  >
                    Share
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
    </>
  );
}