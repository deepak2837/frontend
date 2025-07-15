import React from "react";
import BlogClient from "./BlogClient";
import { API_URL } from "@/config/config";

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

// Generate dynamic metadata based on search parameters
export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = typeof searchParams?.then === "function"
    ? await searchParams
    : searchParams || {};

  const { search, subject, difficulty, sortBy } = resolvedSearchParams;

  let title = "Medical Blogs - Latest Healthcare Insights & Medical Education | MedGloss";
  let description = "Discover comprehensive medical blogs covering healthcare insights, medical education, clinical cases, and the latest developments in medicine. Expert-curated content for healthcare professionals and students.";

  // Customize metadata based on filters
  if (search) {
    title = `Search Results for "${search}" - Medical Blogs | MedGloss`;
    description = `Find medical blogs and articles related to "${search}". Expert-curated content for healthcare professionals and students.`;
  }
  if (subject) {
    title = `${subject} Medical Blogs - Latest Insights & Education | MedGloss`;
    description = `Explore comprehensive ${subject} medical blogs, articles, and educational content. Expert insights for healthcare professionals and students.`;
  }
  if (difficulty) {
    const difficultyText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    title = `${difficultyText} Level Medical Blogs - Healthcare Education | MedGloss`;
    description = `Access ${difficulty} level medical blogs and educational content. Tailored for ${difficulty} learners in healthcare.`;
  }
  if (sortBy === 'trending') {
    title = "Trending Medical Blogs - Popular Healthcare Content | MedGloss";
    description = "Discover trending medical blogs and popular healthcare content. Stay updated with the most engaging medical articles and insights.";
  }
  if (sortBy === 'featured') {
    title = "Featured Medical Blogs - Curated Healthcare Content | MedGloss";
    description = "Explore featured medical blogs and curated healthcare content. Expert-selected articles for medical professionals and students.";
  }

  // Fallbacks for all fields
  title = title || "Medical Blogs | MedGloss";
  description = description || "Explore medical blogs, articles, and resources for healthcare professionals and students.";
  const keywords = [
    "medical blogs", "healthcare insights", "medical education", "clinical cases", "medical articles", "healthcare professionals", "medical students", "medical research", "clinical practice", "medical knowledge",
    ...SUBJECT_OPTIONS
  ].join(", ");
  const authors = [{ name: "Medical Education Team" }];
  const creator = "Medical Education Platform";
  const publisher = "MedGloss";
  const metadataBase = new URL("https://medgloss.com");
  const canonical = "/blog";
  const ogImage = "https://medgloss.com/_next/image?url=%2F3.png&w=1080&q=75";
  const twitterCreator = "@medgloss";

  return {
    title,
    description,
    keywords,
    authors,
    creator,
    publisher,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase,
    alternates: {
      canonical,
    },
    openGraph: {
      title: title || "Medical Blogs | MedGloss",
      description: description || "Explore medical blogs, articles, and resources for healthcare professionals and students.",
      url: "https://medgloss.com/blog",
      siteName: "MedGloss",
      images: [
        {
          url: ogImage,
          width: 1080,
          height: 630,
          alt: title || "Medical Blogs - Healthcare Insights and Education",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || "Medical Blogs | MedGloss",
      description: description || "Explore medical blogs, articles, and resources for healthcare professionals and students.",
      images: [ogImage],
      creator: twitterCreator,
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

// Structured Data for SEO
async function generateStructuredData(searchParams) {
  const resolvedSearchParams = typeof searchParams?.then === "function"
    ? await searchParams
    : searchParams || {};

  const { search, subject, difficulty, sortBy } = resolvedSearchParams;

  let name = "MedGloss Medical Blogs";
  let description = "Comprehensive medical blogs covering healthcare insights, medical education, clinical cases, and the latest developments in medicine.";

  if (search) {
    name = `Search Results: ${search} - Medical Blogs`;
    description = `Medical blogs and articles related to "${search}". Expert-curated content for healthcare professionals.`;
  }
  if (subject) {
    name = `${subject} Medical Blogs`;
    description = `Comprehensive ${subject} medical blogs, articles, and educational content for healthcare professionals.`;
  }
  if (difficulty) {
    const difficultyText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    name = `${difficultyText} Level Medical Blogs`;
    description = `${difficultyText} level medical blogs and educational content tailored for healthcare learners.`;
  }
  if (sortBy === 'trending') {
    name = "Trending Medical Blogs";
    description = "Trending medical blogs and popular healthcare content. Stay updated with the most engaging medical articles.";
  }
  if (sortBy === 'featured') {
    name = "Featured Medical Blogs";
    description = "Featured medical blogs and curated healthcare content. Expert-selected articles for medical professionals.";
  }

  // Fallbacks for all fields
  name = name || "MedGloss Medical Blogs";
  description = description || "Comprehensive medical blogs covering healthcare insights, medical education, clinical cases, and the latest developments in medicine.";

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": name,
    "description": description,
    "url": "https://medgloss.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "MedGloss",
      "logo": {
        "@type": "ImageObject",
        "url": "https://medgloss.com/_next/image?url=%2Fmedglosslogo-photoaidcom-cropped.png&w=1920&q=75"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://medgloss.com/blog"
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Medical Education"
      },
      {
        "@type": "Thing", 
        "name": "Healthcare"
      },
      {
        "@type": "Thing",
        "name": "Clinical Practice"
      }
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Medical Students and Healthcare Professionals"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Dr. Sarah Johnson"
        },
        "reviewBody": "The medical blogs provide valuable insights and keep me updated with the latest developments in healthcare.",
        "name": "Healthcare Professional Review"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Medical Student"
        },
        "reviewBody": "These blogs are essential for my medical education and help me understand complex topics better.",
        "name": "Student Review"
      }
    ]
  };
}

async function getBlogs(searchParams) {
  try {
    const queryParams = new URLSearchParams();
    
    // Add search parameters with proper defaults
    const page = searchParams.page || 1;
    const limit = searchParams.limit || 10;
    
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    if (searchParams.search) queryParams.append('search', searchParams.search);
    if (searchParams.subject) queryParams.append('subject', searchParams.subject);
    if (searchParams.difficulty) queryParams.append('difficulty', searchParams.difficulty);
    if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy);

    const url = `${API_URL}/api/v1/blog?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return { 
        data: [], 
        pagination: { 
          totalPages: 0, 
          currentPage: parseInt(page), 
          hasNext: false, 
          hasPrev: false 
        },
        error: true
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { 
      data: [], 
      pagination: { 
        totalPages: 0, 
        currentPage: parseInt(searchParams.page) || 1, 
        hasNext: false, 
        hasPrev: false 
      },
      error: true
    };
  }
}

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }) {
  // Await searchParams if it's a Promise (per Next.js dynamic API guidance)
  const resolvedSearchParams = typeof searchParams?.then === "function"
    ? await searchParams
    : searchParams || {};

  // Get initial data for SSR
  const initialData = await getBlogs(resolvedSearchParams);
  const structuredData = await generateStructuredData(resolvedSearchParams);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </noscript>
      <BlogClient 
        initialData={initialData}
        subjectOptions={SUBJECT_OPTIONS}
        difficultyOptions={DIFFICULTY_OPTIONS}
        searchParams={resolvedSearchParams}
      />
    </>
  );
}
