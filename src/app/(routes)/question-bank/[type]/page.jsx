// app/question-bank/[type]/page.jsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import EmptyState from "@/components/EmptyState";
import { requireAuth } from "@/utils/auth";
import { API_URL } from "@/config/config";

// SEO Metadata - Dynamic based on params
export async function generateMetadata({ params }) {
  const { type } = await params;
  const decodedType = type ? decodeURIComponent(type) : "";
  
  const title = `${decodedType.charAt(0).toUpperCase() + decodedType.slice(1)} Question Banks - Medical Exam Preparation | MedGloss`;
  const description = `Explore comprehensive ${decodedType} question banks for medical exams. Practice with MCQs, track progress, and improve your ${decodedType} medical knowledge with our specialized question collections.`;
  
  return {
    title,
    description,
    keywords: `${decodedType}, question banks, medical exam preparation, MCQs, medical questions, exam practice, medical education, question bank library, medical students, healthcare education, ${decodedType} practice questions`,
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
      canonical: `/question-bank/${type}`,
    },
    openGraph: {
      title: `${decodedType.charAt(0).toUpperCase() + decodedType.slice(1)} Question Banks - Medical Exam Preparation`,
      description: `Comprehensive ${decodedType} question banks for medical exams. Practice with MCQs and improve your medical knowledge.`,
      url: `https://medgloss.com/question-bank/${type}`,
      siteName: "MedGloss",
      images: [
        {
          url: "https://medgloss.com/_next/image?url=%2F3.png&w=1080&q=75",
          width: 1080,
          height: 630,
          alt: `${decodedType.charAt(0).toUpperCase() + decodedType.slice(1)} Question Banks - Medical Exam Preparation`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedType.charAt(0).toUpperCase() + decodedType.slice(1)} Question Banks - Medical Exam Preparation`,
      description: `Comprehensive ${decodedType} question banks for medical exams. Practice with MCQs.`,
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

// Generate static params for better SEO - Fetch all unique types
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

    // Get unique types
    const uniqueTypes = [...new Set(questionBanks.map((bank) => bank.type).filter(Boolean))];

    // Generate params for each unique type
    const params = uniqueTypes.map((type) => ({
      type: encodeURIComponent(type),
    }));

    console.log(`Generated ${params.length} static params for types:`, uniqueTypes);
    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// This tells Next.js to generate this page at build time
export const dynamic = 'force-static';

export default async function QuestionBankTypePage({ params }) {
  const { type } = await params;

  // Decode params safely
  const typeParam = type ? decodeURIComponent(type) : "";

  // Fetch data server-side
  const response = await getQuestions();

  // Filter banks based on typeParam
  const filteredBanks =
    response?.data?.filter(
      (bank) =>
        bank.type &&
        typeParam &&
        bank.type.toLowerCase() === typeParam.toLowerCase()
    ) || [];

  // Group banks by name for better organization
  const groupedBanks = filteredBanks.reduce((acc, bank) => {
    if (!acc[bank.name]) {
      acc[bank.name] = [];
    }
    acc[bank.name].push(bank);
    return acc;
  }, {});

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${typeParam.charAt(0).toUpperCase() + typeParam.slice(1)} Question Banks`,
    "description": `Comprehensive question banks for ${typeParam} category`,
    "url": `https://medgloss.com/question-bank/${type}`,
    "numberOfItems": Object.keys(groupedBanks).length,
    "itemListElement": Object.keys(groupedBanks).map((bankName, index) => ({
      "@type": "Course",
      "position": index + 1,
      "name": bankName,
      "description": `Question banks for ${bankName} in ${typeParam} category`,
      "provider": {
        "@type": "Organization",
        "name": "MedGloss"
      },
      "url": `https://medgloss.com/question-bank/${type}/${encodeURIComponent(bankName)}`,
      "educationalLevel": "Medical Education",
      "teaches": bankName,
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
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 lg:py-8">
        {/* Header - Bigger on desktop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 lg:mb-10 gap-2 sm:gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              {typeParam.charAt(0).toUpperCase() + typeParam.slice(1)} Question Banks
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-500 mt-1 lg:mt-2">
              Browse and explore question banks for {typeParam} category
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
        {Object.keys(groupedBanks).length === 0 ? (
          <EmptyState
            icon="question"
            title="No question banks found"
            message={`There are no question banks available for ${typeParam} category.`}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Object.keys(groupedBanks).map((bankName) => (
              <Link
                key={bankName}
                href={`/question-bank/${type}/${encodeURIComponent(bankName)}`}
                className="group"
              >
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {groupedBanks[bankName].length} banks
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                    {bankName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Explore question banks for {bankName} in {typeParam} category
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View Banks
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 