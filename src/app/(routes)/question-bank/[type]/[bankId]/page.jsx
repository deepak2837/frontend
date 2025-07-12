// app/question-bank/[type]/[bankId]/page.jsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import BankCard from "./BankCard";
import EmptyState from "@/components/EmptyState";
import { requireAuth } from "@/utils/auth";
import { API_URL } from "@/config/config";

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
  const { type, bankId } = await params;
  const decodedType = type ? decodeURIComponent(type) : "";
  const decodedBankId = bankId ? decodeURIComponent(bankId) : "";
  
  const title = `${decodedBankId} Question Banks - ${decodedType.charAt(0).toUpperCase() + decodedType.slice(1)} Medical Exam Preparation | MedGloss`;
  const description = `Explore comprehensive ${decodedBankId} question banks for ${decodedType} medical exams. Practice with MCQs, track progress, and improve your medical knowledge with our specialized question collections.`;
  
  return {
    title,
    description,
    keywords: [
      decodedBankId,
      decodedType,
      "question banks", "medical exam preparation", "MCQs", "medical questions", "exam practice", "medical education", "question bank library", "medical students", "healthcare education",
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
      canonical: `/question-bank/${type}/${bankId}`,
    },
    openGraph: {
      title: `${decodedBankId} Question Banks - ${decodedType.charAt(0).toUpperCase() + decodedType.slice(1)} Medical Preparation`,
      description: `Comprehensive ${decodedBankId} question banks for ${decodedType} medical exams. Practice with MCQs and improve your medical knowledge.`,
      url: `https://medgloss.com/question-bank/${type}/${bankId}`,
      siteName: "MedGloss",
      images: [
        {
          url: "https://medgloss.com/_next/image?url=%2F3.png&w=1080&q=75",
          width: 1080,
          height: 630,
          alt: `${decodedBankId} Question Banks - Medical Exam Preparation`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedBankId} Question Banks - ${decodedType.charAt(0).toUpperCase() + decodedType.slice(1)} Medical Preparation`,
      description: `Comprehensive ${decodedBankId} question banks for ${decodedType} medical exams. Practice with MCQs.`,
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

// Fetch questions from your API
async function getQuestions(token) {
  try {
    const response = await fetch(`${API_URL}/api/v1/question-bank/list/live`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensures fresh data on each request
    });

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    return { data: [] };
  }
}

// Generate static params for better SEO - Fetch all type/bankId combinations
export async function generateStaticParams() {
  try {
    // Fetch all question banks from the API
    const response = await fetch(`${API_URL}/api/v1/question-bank/list/live`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch question banks for static generation");
      return [];
    }

    const data = await response.json();
    const questionBanks = data.data || [];

    // Group by type and name to get unique combinations
    const uniqueCombinations = new Set();
    questionBanks.forEach((bank) => {
      if (bank.type && bank.name) {
        uniqueCombinations.add(`${bank.type}-${bank.name}`);
      }
    });

    // Generate params for each unique type/bankId combination
    const params = Array.from(uniqueCombinations).map((combination) => {
      const [type, bankId] = combination.split('-');
      return {
        type: encodeURIComponent(type),
        bankId: encodeURIComponent(bankId),
      };
    });

    console.log(`Generated ${params.length} static params for type/bankId combinations`);
    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// This tells Next.js to generate this page at build time
export const dynamic = 'force-static';

// Helper to generate ItemList schema for sub-banks
function getItemListSchema(filteredBanks, typeParam, bankIdParam) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${bankIdParam} Question Banks`,
    "itemListElement": filteredBanks.map((bank, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": bank.title || bank.name,
      "url": `https://medgloss.com/question-bank/${encodeURIComponent(typeParam)}/${encodeURIComponent(bankIdParam)}/${encodeURIComponent(bank.title || bank.name).toLowerCase().replace(/\s+/g, "-")}/${bank._id}`
    }))
  };
}

export default async function QuestionBanksPage({ params }) {
  // Get authentication token from cookies
  // const token = requireAuth();
  const { type, bankId } = await params;
  // // Check authentication
  // if (!token) {
  //   redirect("/login");
  // }

  // Decode params safely
  const bankIdParam = bankId ? decodeURIComponent(bankId) : "";
  const typeParam = type ? decodeURIComponent(type) : "";

  // Fetch data server-side
  const response = await getQuestions();

  // Filter banks based on bankIdParam
  const filteredBanks =
    response?.data?.filter(
      (bank) =>
        bank.name &&
        bankIdParam &&
        bank.name.toLowerCase() === bankIdParam.toLowerCase()
    ) || [];

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${bankIdParam} Question Banks`,
    "description": `Comprehensive question banks for ${bankIdParam} in ${typeParam} category`,
    "url": `https://medgloss.com/question-bank/${type}/${bankId}`,
    "numberOfItems": filteredBanks.length,
    "itemListElement": filteredBanks.map((bank, index) => ({
      "@type": "Course",
      "position": index + 1,
      "name": bank.title || bank.name,
      "description": bank.description || `Question bank for ${bankIdParam}`,
      "provider": {
        "@type": "Organization",
        "name": "MedGloss"
      },
      "url": `https://medgloss.com/question-bank/${type}/${bankId}/${encodeURIComponent(bank.title || bank.name)}/${bank._id}`,
      "educationalLevel": "Medical Education",
      "teaches": bankIdParam,
      "category": typeParam
    })),
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
          "name": typeParam.charAt(0).toUpperCase() + typeParam.slice(1),
          "item": `https://medgloss.com/question-bank/${type}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": bankIdParam,
          "item": `https://medgloss.com/question-bank/${type}/${bankId}`
        }
      ]
    }
  };

  return (
    <>
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* ItemList schema for sub-banks */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getItemListSchema(filteredBanks, typeParam, bankIdParam)),
        }}
      />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 lg:py-8">
        {/* Header - Bigger on desktop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 lg:mb-10 gap-2 sm:gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              {typeParam.charAt(0).toUpperCase() + typeParam.slice(1)} Question
              Banks
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-1 lg:mt-2">
              Browse and explore question banks for {bankIdParam}
            </p>
          </div>
          <Link href="/question-bank">
            <button className="bg-primary hover:bg-primary/90 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-lg font-medium flex items-center gap-1.5 transition shadow-md hover:shadow-lg text-xs sm:text-sm lg:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Categories
            </button>
          </Link>
        </div>

        {/* Content Area: Responsive Grid or Empty State */}
        {filteredBanks.length === 0 ? (
          <EmptyState
            icon="question"
            title="No question banks found"
            message="There are no question banks available for this category."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredBanks.map((bank) => (
              <BankCard key={bank._id} bank={bank} typeParam={typeParam} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
