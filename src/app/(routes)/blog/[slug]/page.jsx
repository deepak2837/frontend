"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import useGetBlogDetails from "@/hooks/blog/useGetBlogDetails";
import useBlogEngagement from "@/hooks/blog/useBlogEngagement";
import LineLoader from "@/components/common/Loader";
import { useParams } from "next/navigation";
// import TopAdSection from "@/components/AdSection/TopAdSection";
// import Aside from "@/components/AdSection/Aside";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Head from "next/head";

export default function BlogPost() {
  const params = useParams();
  const { data: blog, isLoading, error } = useGetBlogDetails(params?.slug);
  const router = useRouter();
  
  // Use the blog engagement hook
  const { isLiked, likeCount, isLoading: likeLoading, toggleLike, updateLikeCount } = useBlogEngagement(blog?._id);

  // Carousel state for related posts
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  // Calculate how many cards to show based on screen size
  const getCardsToShow = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 1024) return 2; // tablet
    return 3; // desktop
  };

  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const updateCardsToShow = () => setCardsToShow(getCardsToShow());
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  const maxSlides = blog?.relatedResources ? Math.ceil(blog.relatedResources.length / cardsToShow) : 0;

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };


  // Set document title and meta tags when blog data is loaded
  useEffect(() => {
    if (blog && blog._id) {
      // Update like count from blog data
      updateLikeCount(blog.likeCount || 0);
      

      
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
          }
    }, [blog?._id, updateLikeCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Ad Section - Hidden on mobile */}
        {/* <div className="hidden md:block">
          <TopAdSection className="sticky top-0 z-50" />
        </div> */}

        <div className="w-full px-0 sm:px-4 py-4 lg:max-w-[calc(100%-520px)] lg:mx-auto flex-1">
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
              
              <div className="flex gap-4 text-sm text-gray-600 mb-4 justify-center items-center">
                <span>{new Date(blog?.createdAt || blog?.publishedAt).toLocaleDateString()}</span>
                <span>• {blog?.readingTime || blog?.seo?.readingTime} min read</span>
                <span>• {blog?.viewCount} views</span>
                
                {/* Like Button - Moved to header */}
                <div className="flex items-center gap-2 ml-4 min-w-[80px]">
                  <button
                    onClick={toggleLike}
                    disabled={likeLoading}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 ${
                      isLiked
                        ? "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } ${likeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={`${isLiked ? 'Unlike' : 'Like'} this post`}
                  >
                    <svg
                      className={`w-4 h-4 ${isLiked ? 'animate-pulse' : ''}`}
                      fill={isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="font-medium text-sm">{likeCount}</span>
                  </button>
                  <span className="text-xs text-gray-500">
                    {likeLoading
                      ? <span className="opacity-0">00</span> // invisible placeholder
                      : (likeCount === 1 ? 'loved it' : 'loved it')}
                  </span>
                </div>
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
              <div className="mb-8 relative aspect-[16/9] w-full">
                <Image
                  src={blog.coverImage}
                  alt={blog.seo?.metaTitle || blog.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="prose max-w-none quill-content min-h-[200px]">
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
                  {/* Like Button - Also in footer */}
                  <div className="flex flex-col items-center min-w-[120px]">
                    <button
                      onClick={toggleLike}
                      disabled={likeLoading}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                        isLiked
                          ? "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } ${likeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label={`${isLiked ? 'Unlike' : 'Like'} this post`}
                    >
                      <svg
                        className={`w-6 h-6 ${isLiked ? 'animate-pulse' : ''}`}
                        fill={isLiked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="font-semibold text-lg">{likeCount}</span>
                    </button>
                    {/* Like count text */}
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                      {likeLoading
                        ? <span className="opacity-0">00 people loved it</span>
                        : (likeCount === 1 ? 'person loved it' : `${likeCount} people loved it`)}
                    </p>
                  </div>
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

            {/* Related Blog Posts Section */}
            {blog?.relatedResources && blog.relatedResources.length > 0 && (
              <section className="mt-12 pt-8 border-t">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Recommended Reads
                  </h2>
                  <p className="text-gray-600">
                    Explore related articles that might interest you
                  </p>
                </div>
                
                {/* Carousel Container */}
                <div className="relative">
                  {/* Navigation Arrows */}
                  {currentSlide > 0 && (
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                      aria-label="Previous posts"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  
                  {currentSlide < maxSlides - 1 && (
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                      aria-label="Next posts"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}

                  {/* Carousel Track */}
                  <div 
                    ref={carouselRef}
                    className="overflow-hidden"
                  >
                    <div 
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentSlide * (100 / cardsToShow)}%)`,
                        width: `${(blog.relatedResources.length / cardsToShow) * 100}%`
                      }}
                    >
                      {blog.relatedResources.map((relatedPost, index) => (
                        <div
                          key={relatedPost._id || index}
                          className="flex-shrink-0"
                          style={{ width: `${100 / blog.relatedResources.length}%` }}
                        >
                          <div className="px-2">
                            <article
                              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100 overflow-hidden group"
                              onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                            >
                              {/* Cover Image */}
                              <div className="relative h-32 overflow-hidden">
                                <Image
                                  src={relatedPost.coverImage || '/placeholder-blog.jpg'}
                                  alt={relatedPost.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                {/* View count badge */}
                                <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded-full">
                                  {relatedPost.viewCount}
                                </div>
                                {/* Similarity score badge */}
                                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                  {relatedPost.similarityScore}%
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="p-3">
                                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                  {relatedPost.title}
                                </h3>
                                
                                {/* Read more link */}
                                <div className="flex items-center justify-between">
                                  <span className="text-blue-600 text-xs font-medium group-hover:text-blue-700 transition-colors">
                                    Read more →
                                  </span>
                                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {relatedPost.viewCount}
                                  </div>
                                </div>
                              </div>
                            </article>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Carousel Indicators */}
                {maxSlides > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: maxSlides }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-blue-500 w-6' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

               
              </section>
            )}
          </article>
        </div>

        {/* Side Ad Section - Hidden on mobile */}
        {/* <div className="hidden md:block">
          <Aside />
        </div> */}

        {/* Bottom Ad Section for mobile only */}
        {/* <div className="block md:hidden">
          <TopAdSection className="mt-8" />
        </div> */}
        
        {/* Footer - This ensures the footer stays at the bottom */}
        <footer className="z-10 mt-auto w-full bg-gray-50 border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
            © 2024 MedGloss. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}