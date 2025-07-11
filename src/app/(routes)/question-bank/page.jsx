// Next.js server component
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LineLoader from "@/components/common/Loader";
import subjectImage from "../../../../public/subjects.png";
import examsImage from "../../../../public/exams.png";
import coursesImage from "../../../../public/courses.png";
import ClientSideSearch from "@/components/QuestionBank/ClientSideSearch";
import QuestionBankContent from "@/components/QuestionBank/QuestionBankContent";
import { API_URL } from "@/config/config";
import { requireAuth } from "@/utils/auth";

// SEO Metadata
const subjectNames = [
  "MEDICINE",
  "Surgery",
  "Pharmacology",
  "Microbiology",
  "Pathology",
  "Anatomy",
  "Biochemistry",
  "Physiology",
  "Forensic medicine and toxicology",
  "community medicine",
  "Obstetrics and Gynaecology",
  "Pediatrics",
  "Psychiatry",
  "Anaesthesiology",
  "Ophthalmology",
  "ENT (Otolaryngology)",
  "Dermatology and Venereology",
  "Orthopedics",
  "ENT (Otorhinolaryngology)",
  "Dermatology",
  "Radiology",
  "PSM"
];

export const metadata = {
  title: "Question Banks - Comprehensive Medical Exam Preparation Resources | MedGloss",
  description: "Access comprehensive question banks for medical exams, subjects, and courses. Practice with thousands of MCQs, track your progress, and improve your medical knowledge with our extensive question bank library.",
  keywords: [
    "question banks", "medical exam preparation", "MCQs", "medical questions", "exam practice", "medical education", "question bank library", "medical students", "healthcare education", "medical assessment",
    ...subjectNames
  ].join(", "),
  authors: [{ name: "Medical Education Team" }],
  creator: "Medical Education Platform",
  publisher: "MedGloss",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://medgloss.com"),
  alternates: {
    canonical: "/question-bank",
  },
  openGraph: {
    title: "Question Banks - Medical Exam Preparation Resources",
    description: "Comprehensive question banks for medical exams, subjects, and courses. Practice with thousands of MCQs and improve your medical knowledge.",
    url: "https://medgloss.com/question-bank",
    siteName: "MedGloss",
    images: [
      {
        url: "https://medgloss.com/_next/image?url=%2F3.png&w=1080&q=75",
        width: 1080,
        height: 630,
        alt: "Medical Question Banks - Comprehensive Exam Preparation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Question Banks - Medical Exam Preparation Resources",
    description: "Comprehensive question banks for medical exams, subjects, and courses. Practice with thousands of MCQs.",
    images: ["https://medgloss.com/_next/image?url=%2F3.png&w=1080&q=75"],
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

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "MedGloss",
  "description": "Leading platform for medical education with comprehensive question banks and exam preparation resources.",
  "url": "https://medgloss.com/question-bank",
  "logo": "https://medgloss.com/_next/image?url=%2Fmedglosslogo-photoaidcom-cropped.png&w=1920&q=75",
  "sameAs": [
    "https://x.com/medgloss",
    "https://www.linkedin.com/company/medgloss",
    "https://www.instagram.com/medgloss_official"
  ],
  "hasOfferingCatalog": {
    "@type": "OfferingCatalog",
    "name": "Medical Question Banks",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "Medical Exam Question Banks",
        "description": "Comprehensive question banks for various medical examinations",
        "provider": {
          "@type": "Organization",
          "name": "MedGloss"
        }
      },
      {
        "@type": "Course",
        "name": "Subject-Specific Question Banks",
        "description": "Specialized question banks organized by medical subjects",
        "provider": {
          "@type": "Organization",
          "name": "MedGloss"
        }
      },
      {
        "@type": "Course",
        "name": "Course-Based Question Banks",
        "description": "Question banks aligned with specific medical courses",
        "provider": {
          "@type": "Organization",
          "name": "MedGloss"
        }
      }
    ]
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
        "name": "Dr. Emily Watson"
      },
      "reviewBody": "The question banks helped me prepare thoroughly for my medical exams. The variety and quality of questions are excellent.",
      "name": "Medical Student Review"
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
        "name": "Prof. Michael Chen"
      },
      "reviewBody": "As an educator, I find these question banks to be comprehensive and well-structured for student learning.",
      "name": "Faculty Review"
    }
  ]
};

function getItemListSchema(groupedByType) {
  const itemList = [];
  let position = 1;
  for (const type in groupedByType) {
    for (const name in groupedByType[type]) {
      itemList.push({
        "@type": "ListItem",
        "position": position++,
        "name": `${name} (${type})`,
        "url": `https://medgloss.com/question-bank/${encodeURIComponent(type)}/${encodeURIComponent(name)}`
      });
    }
  }
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Question Bank Subjects and Categories",
    "itemListElement": itemList
  };
}

const categoryIcons = {
  exam: examsImage,
  subject: subjectImage,
  course: coursesImage,
};

const difficultyColors = {
  easy: "bg-green-100 text-green-800 ring-1 ring-green-200",
  medium: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
  hard: "bg-red-100 text-red-800 ring-1 ring-red-200",
};

async function getQuestions(token) {
  try {
    const response = await fetch(`${API_URL}/api/v1/question-bank/list/live`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 36000 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return { error: true };
  }
}

export async function generateStaticParams() {
  return [];
}

export const dynamic = 'force-static';

export default async function Page() {
  const response = await getQuestions(null);
  const isError = response.error;
  const data = response.data;

  if (isError) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <noscript>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        </noscript>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
          <div className="bg-red-50 p-6 rounded-xl shadow-md max-w-md w-full text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118-0z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-700 mb-2">Unable to Load Question Banks</h2>
            <p className="text-gray-600 mb-4">We encountered an error while fetching data. Please try again later.</p>
            <form action="/" method="get">
              <button type="submit" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2 mx-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <noscript>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        </noscript>
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-md">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9.01 9.01 0 01.128 1.5A8.98 8.98 0 005 12a9 9 0 0113.8 1.6" />
            </svg>
            <div className="text-gray-600 text-xl font-medium mb-2">No question banks found</div>
            <p className="text-gray-500">Please check back later for new content.</p>
          </div>
        </div>
      </>
    );
  }

  const groupedByType = data.reduce((acc, bank) => {
    if (!acc[bank.type]) {
      acc[bank.type] = {};
    }
    if (!acc[bank.type][bank.name]) {
      acc[bank.type][bank.name] = [];
    }
    acc[bank.type][bank.name].push(bank);
    return acc;
  }, {});

  const allCategories = Object.keys(groupedByType);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getItemListSchema(groupedByType)) }} />
      <noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getItemListSchema(groupedByType)) }} />
      </noscript>
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-primary text-white px-4 py-2 rounded z-50">Skip to main content</a>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <header className="relative bg-gradient-to-r from-primary to-primary/80 rounded-xl md:rounded-2xl mb-6 md:mb-8 overflow-hidden max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
          <div className="absolute inset-0 bg-pattern opacity-10" aria-hidden="true"></div>
          <div className="relative p-5 md:p-8 lg:p-12 text-white">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-2 md:mb-3 leading-tight" aria-label="Find the Perfect Question Bank">
              Find the Perfect<br />Question Bank
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-2xl mb-4 md:mb-6">
              Access comprehensive collections to enhance your preparation
            </p>
            <ClientSideSearch />
          </div>
          <div className="absolute right-0 bottom-0 hidden lg:block" aria-hidden="true">
            <svg width="200" height="120" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="150" r="120" fill="white" fillOpacity="0.1" />
              <circle cx="220" cy="120" r="80" fill="white" fillOpacity="0.1" />
            </svg>
          </div>
        </header>
        <main id="main-content" className="flex-1">
          <section aria-label="Question Bank Content">
            <div className="max-w-7xl mx-auto px-4">
              <QuestionBankContent
                groupedByType={groupedByType}
                categoryIcons={categoryIcons}
                difficultyColors={difficultyColors}
              />
            </div>
          </section>
        </main>
        <footer className="z-10 mt-auto w-full bg-gray-50 border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
            © 2024 MedGloss. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
