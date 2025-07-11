// app/question-bank/[type]/[bankId]/[title]/[id]/page.jsx
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LineLoader from "@/components/common/Loader";
import QuestionBankClientPage from "./client-page";
import { requireAuth } from "@/utils/auth";

const REQUIRE_QUESTION_BANK_AUTH = process.env.NEXT_PUBLIC_QUESTION_BANK_AUTHENTICATION === "true";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Subject names for SEO keywords (from main page)
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

// SEO Metadata - Dynamic based on params
export async function generateMetadata({ params }) {
  const { type, bankId, title, id } = await params;
  const decodedType = type ? decodeURIComponent(type) : "";
  const decodedBankId = bankId ? decodeURIComponent(bankId) : "";
  const decodedTitle = title ? decodeURIComponent(title) : "";
  
  const titleText = `${decodedTitle} - ${decodedBankId} Question Bank | ${decodedType.charAt(0).toUpperCase() + decodedType.slice(1)} Medical Practice | MedGloss`;
  const description = `Practice ${decodedTitle} questions from our comprehensive ${decodedBankId} question bank. Access MCQs, track your progress, and improve your ${decodedType} medical knowledge with detailed explanations and performance analytics.`;
  
  return {
    title: titleText,
    description,
    keywords: [
      decodedTitle,
      decodedBankId,
      decodedType,
      "question bank", "medical MCQs", "exam practice", "medical questions", "healthcare education", "medical students", `${decodedType} practice questions`, "medical assessment", "clinical knowledge",
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
      canonical: `/question-bank/${type}/${bankId}/${title}/${id}`,
    },
    openGraph: {
      title: `${decodedTitle} - ${decodedBankId} Question Bank Practice`,
      description: `Practice ${decodedTitle} questions from our comprehensive ${decodedBankId} question bank. Access MCQs and improve your ${decodedType} medical knowledge.`,
      url: `https://medgloss.com/question-bank/${type}/${bankId}/${title}/${id}`,
      siteName: "MedGloss",
      images: [
        {
          url: "https://medgloss.com/_next/image?url=%2F3.png&w=1080&q=75",
          width: 1080,
          height: 630,
          alt: `${decodedTitle} Question Bank - Medical Practice Questions`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedTitle} - ${decodedBankId} Question Bank Practice`,
      description: `Practice ${decodedTitle} questions from our comprehensive ${decodedBankId} question bank. Access MCQs and improve your medical knowledge.`,
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
}

// Server component that fetches data
async function fetchInitialData(id) {
  async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value;
  }
  
  let token = null;
 
  if (REQUIRE_QUESTION_BANK_AUTH) {
    token = await requireAuth();
    if (!token) {
      redirect("/login");
    }
  }

  const headers = REQUIRE_QUESTION_BANK_AUTH || await getAuthToken?.()
    ? { Authorization: `Bearer ${await getAuthToken?.()}` }
    : {};

  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/question-bank/questions-full/${id}?page=1&limit=5`,
      {
        headers,
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching question bank data:", error);
    return {
      questions: [],
      pagination: { totalPages: 0, currentPage: 1 },
    };
  }
}

// Generate static params for better SEO
export async function generateStaticParams() {
  // This would ideally fetch all possible question bank IDs
  // For now, return empty array to allow dynamic generation
  return [];
}

// This tells Next.js to generate this page at build time
export const dynamic = 'force-static';

// Helper to generate ItemList schema for questions
function getItemListSchema(questions, pageUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Question Bank Questions",
    "itemListElement": (questions || []).map((q, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": q.question,
      "url": pageUrl
    }))
  };
}

export default async function QuestionBankPage({ params }) {
  const { type, bankId, title, id } = await params;
  const initialData = await fetchInitialData(id);

  // Decode params safely
  const decodedType = type ? decodeURIComponent(type) : "";
  const decodedBankId = bankId ? decodeURIComponent(bankId) : "";
  const decodedTitle = title ? decodeURIComponent(title) : "";

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${decodedTitle} Question Bank`,
    "description": `Comprehensive question bank for ${decodedTitle} in ${decodedBankId} category. Practice with MCQs and improve your ${decodedType} medical knowledge.`,
    "url": `https://medgloss.com/question-bank/${type}/${bankId}/${title}/${id}`,
    "provider": {
      "@type": "Organization",
      "name": "MedGloss",
      "url": "https://medgloss.com"
    },
    "educationalLevel": "Medical Education",
    "teaches": decodedTitle,
    "category": decodedType,
    "subject": decodedBankId,
    "numberOfQuestions": initialData.questions?.length || 0,
    "learningResourceType": "Question Bank",
    "interactivityType": "active",
    "typicalAgeRange": "18-25",
    "audience": {
      "@type": "Audience",
      "audienceType": "Medical Students"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://medgloss.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Question Banks",
          "item": "https://medgloss.com/question-bank"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": decodedType.charAt(0).toUpperCase() + decodedType.slice(1),
          "item": `https://medgloss.com/question-bank/${type}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": decodedBankId,
          "item": `https://medgloss.com/question-bank/${type}/${bankId}`
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": decodedTitle,
          "item": `https://medgloss.com/question-bank/${type}/${bankId}/${title}/${id}`
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
          "name": "Amit Kumar"
        },
        "reviewBody": `Excellent question bank for ${decodedTitle}. The questions are well-structured and help reinforce key concepts.`,
        "name": `${decodedTitle} Question Bank Review`
      }
    ],
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free access to comprehensive question bank"
    }
  };

  // Build the page URL for the ItemList schema
  const pageUrl = `https://medgloss.com/question-bank/${type}/${bankId}/${title}/${id}`;

  return (
    <>
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* ItemList schema for questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getItemListSchema(initialData.questions, pageUrl)),
        }}
      />
      
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LineLoader />
          </div>
        }
      >
        <QuestionBankClientPage
          id={id}
          initialQuestions={initialData.questions || []}
          initialTotalPages={initialData.pagination?.totalPages || 0}
        />
      </Suspense>
    </>
  );
}

// This enables the page to be statically generated at build time
// with the provided paths, but also allows for on-demand rendering
export const dynamicParams = true;
