"use client";
import styles from "./CollegeCard.module.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "./Header";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import SpinnerLoader from "../spinner/SpinnerLoader";
import { getUniversitiesWithPYQ } from "@/services/pyqService";

// This will be populated from API
const uniqueCollegeList = [];

const UniversityCards = ({ name, universityName }) => {
  const router = useRouter();

  const handleClick = () => {
    const universitySlug = universityName
      .replace(/,/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    router.push(`/pyq/${encodeURIComponent(universitySlug)}/coursename`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.flexContainer}>
        <div className={styles.imageContainer}>
          <Image
            src="/college.png"
            alt="College Image"
            height={100}
            width={100}
            className="object-contain"
          />
        </div>
        <h2 className={styles.title}>{universityName}</h2>
      </div>
    </div>
  );
};

const MainContent = () => {
  const [visibleColleges, setVisibleColleges] = useState(15);
  const [colleges, setColleges] = useState([]);
  const [allColleges, setAllColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadMoreColleges = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleColleges((prev) => prev + 9);
      setColleges(allColleges.slice(0, visibleColleges + 9));
      setLoading(false);
    }, 500);
  };

  const scrollRef = useBottomScrollListener(loadMoreColleges);

  // Fetch universities from API
  const fetchUniversities = async () => {
    try {
      setInitialLoading(true);
      const universities = await getUniversitiesWithPYQ();
      
      // Convert to the format expected by the component
      const universityObjects = universities.map(universityName => ({
        universityName,
        collegeName: universityName // Using university name as college name for consistency
      }));
      
      setAllColleges(universityObjects);
      setColleges(universityObjects.slice(0, visibleColleges));
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    setColleges(allColleges.slice(0, visibleColleges));
  }, [visibleColleges, allColleges]);

  if (initialLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <SpinnerLoader />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="h-screen overflow-y-auto" ref={scrollRef}>
        <div className="bg-white md:mb-20 mb-5">
          <div className="">
            {colleges.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 py-8 bg-white">
                  {colleges.map((college, index) => (
                    <UniversityCards
                      key={index}
                      name={college.collegeName}
                      universityName={college.universityName}
                    />
                  ))}
                </div>
                {loading && (
                  <div className="flex justify-center mt-4">
                    <SpinnerLoader />
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No PYQ Papers Available</h3>
                  <p className="text-gray-500">No previous year question papers have been uploaded yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContent;
