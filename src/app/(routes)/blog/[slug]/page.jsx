import React from "react";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { API_URL } from "@/config/config";
import allSlugsList from "./allslugslist.json";


// Function to get blog data by slug
async function getBlogBySlug(slug) {
  try {
    const response = await fetch(`${API_URL}/api/v1/blog/${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// Generate static params for popular blog slugs only (top 1000)
export async function generateStaticParams() {
  const popularSlugs = allSlugsList.data
  
  // Limit to top 1000 most popular blogs for static generation
  const limitedSlugs = popularSlugs.slice(0, 19500);
  
  // console.log(`Generating ${limitedSlugs.length} static blog pages`);
  
  // Log first 5 slugs for debugging
  if (limitedSlugs.length > 0) {
    
  }
  
  return limitedSlugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }) {
  const resolvedParams = typeof params?.then === "function"
    ? await params
    : params || {};

  const { slug } = resolvedParams;
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    return {
      title: "Blog Post Not Found | MedGloss",
      description: "The requested blog post could not be found.",
    };
  }

  const title = blog.seo?.metaTitle || blog.title;
  const description = blog.seo?.metaDescription || blog.description;
  const keywords = blog.seo?.metaKeywords?.join(', ') || blog.tags?.join(', ');
  const canonicalUrl = blog.seo?.canonicalURL || `https://medgloss.com/blog/${params.slug}`;
  // Merge tags from both arrays if both are available
  const mergedTags = Array.isArray(blog.seo?.metaKeywords) && Array.isArray(blog.tags)
    ? [...blog.seo.metaKeywords, ...blog.tags]
    : blog.seo?.metaKeywords || blog.tags || [];
  const ogImage = blog.seo?.ogImage || blog.coverImage;

  return {
    title,
    description,
    keywords,
    authors: [{ name: blog.author || "Medical Education Team" }],
    creator: "Medical Education Platform",
    publisher: "MedGloss",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL("https://medgloss.com"),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "MedGloss",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author || "Medical Education Team"],
      section: blog.subject || blog.category,
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@medgloss",
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "6nZhB5qr_BAhWcPGHaPqnpgZ3LcGf40ghiUsEsrqiP0",
      yahoo: "6nZhB5qr_BAhWcPGHaPqnpgZ3LcGf40ghiUsEsrqiP0",
      bing: "6nZhB5qr_BAhWcPGHaPqnpgZ3LcGf40ghiUsEsrqiP0",
    },
  };
}

// Generate structured data for SEO
function generateStructuredData(blog, slug) {
  const baseUrl = "https://medgloss.com";
  const canonicalUrl = blog.seo?.canonicalURL || `${baseUrl}/blog/${slug}`;
  
  let structuredData = {
          "@context": "https://schema.org",
    "@type": blog.seo?.schemaType || "Article",
    "headline": blog.seo?.metaTitle || blog.title,
    "description": blog.seo?.metaDescription || blog.description,
    "image": blog.seo?.ogImage || blog.coverImage,
          "author": {
            "@type": "Person",
      "name": blog.author || "Medical Education Team"
          },
          "publisher": {
            "@type": "Organization",
      "name": "MedGloss",
            "logo": {
              "@type": "ImageObject",
        "url": "https://medgloss.com/_next/image?url=%2Fmedglosslogo-photoaidcom-cropped.png&w=1920&q=75"
            }
          },
          "datePublished": blog.publishedAt,
          "dateModified": blog.updatedAt,
          "mainEntityOfPage": {
            "@type": "WebPage",
      "@id": canonicalUrl
    },
    "wordCount": blog.wordCount || 0,
    "timeRequired": `PT${blog.readingTime || blog.seo?.readingTime || 5}M`,
    "keywords": blog.seo?.metaKeywords?.join(', ') || blog.tags?.join(', '),
          "articleSection": blog.subject || blog.category,
          "about": {
            "@type": "Thing",
      "name": blog.seo?.topic || blog.title
          }
        };

  // Add medical schema if it's a medical article
  if (blog.seo?.schemaType === "MedicalWebPage" || blog.subject) {
          structuredData["@type"] = "MedicalWebPage";
          structuredData.medicalAudience = {
            "@type": "MedicalAudience",
            "audienceType": "Student"
          };
          structuredData.about = {
            "@type": "MedicalCondition",
      "name": blog.seo?.topic || blog.title
    };
  }

  // Add breadcrumb schema
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blogs",
        "item": `${baseUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": canonicalUrl
      }
    ]
  };

  return { article: structuredData, breadcrumb: breadcrumbData };
}

// Use ISR (Incremental Static Regeneration) instead of full static generation
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPost({ params }) {
  //await the params 
  const resolvedParams = typeof params?.then === "function"
    ? await params
    : params || {};

  const { slug } = resolvedParams;
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    notFound();
  }

  const structuredData = generateStructuredData(blog,slug);


  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      <noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.article) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      </noscript>
      <BlogPostClient blog={blog} />
    </>
  );
}