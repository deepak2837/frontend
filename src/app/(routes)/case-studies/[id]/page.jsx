// File: app/case-studies/[id]/page.jsx (Detail page)
"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Aside from "@/components/AdSection/Aside";
import BottomAdSection from "@/components/AdSection/BottomAdSection";
import TopAdSection from "@/components/AdSection/TopAdSection";
import LineLoader from "@/components/common/Loader";
import realCaseStudyData from "@/lib/realCaseStudyData.js";

export default function CaseStudyDetail({ params }) {
  const [loading, setLoading] = useState(true);
  const [caseStudy, setCaseStudy] = useState(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    
    // Find the case study by id
    const study = realCaseStudyData.find(item => item.id.toString() === id);
    
    if (study) {
      setCaseStudy(study);
      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      // Redirect to main page if case study not found
      router.push('/case-studies');
    }
  }, [id, router]);

  const handleBackClick = () => {
    router.back();
  };

  const handleCardClick = (studyId) => {
    router.push(`/case-studies/${studyId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LineLoader />
      </div>
    );
  }

  return (
    <>
      <Aside />
      <TopAdSection />
      <div className="main">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Back button */}
          <button 
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 group"
          >
            <svg 
              className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Case Studies
          </button>

          {/* Case study header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{caseStudy.title}</h1>
            <div className="flex items-center text-gray-600 text-sm mb-6">
              <span className="mr-6">Published: {caseStudy.date}</span>
              {caseStudy.author && <span className="mr-6">Author: {caseStudy.author}</span>}
              {caseStudy.subject && <span className="mr-6">Subject: {caseStudy.subject}</span>}
              {caseStudy.disease && <span>Disease: {caseStudy.disease}</span>}
            </div>
          </div>

          {/* Featured image */}
          {caseStudy.featured_image && caseStudy.featured_image !== "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" && (
            <div className="mb-8 rounded-lg overflow-hidden h-64 md:h-96 relative">
              <Image 
                src={caseStudy.featured_image} 
                alt={caseStudy.title}
                layout="fill"
                objectFit="cover"
                className="w-full"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Short description */}
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Summary</h2>
              <p className="text-gray-800">{caseStudy.description}</p>
            </div>

            {/* Full content with original HTML structure */}
            {caseStudy.fullContent && (
              <div 
                className="case-study-content"
                dangerouslySetInnerHTML={{ __html: caseStudy.fullContent }}
              />
            )}
          </div>

          {/* Related case studies */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Related Case Studies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {realCaseStudyData
                .filter(study => study.id !== caseStudy.id && 
                  (study.subject === caseStudy.subject || study.disease === caseStudy.disease))
                .slice(0, 2)
                .map(study => (
                  <div 
                    key={study.id}
                    onClick={() => handleCardClick(study.id)}
                    className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-40 relative">
                      <Image 
                        src={study.featured_image || study.image} 
                        alt={study.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{study.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{study.date}</p>
                      <p className="text-gray-700 line-clamp-2">{study.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <BottomAdSection />
    </>
  );
}
