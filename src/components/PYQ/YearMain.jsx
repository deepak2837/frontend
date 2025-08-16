"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Download, Eye } from "lucide-react";
import styles from './Year.module.css';
import { getYearsForUniversityCourseSubject, getPYQPapers } from "@/services/pyqService";
import SpinnerLoader from "../spinner/SpinnerLoader";
const YearCards = ({ name, universityName, coursename, subjectName }) => {

  const router = useRouter();
  console.log(universityName,name,coursename,subjectName);
  const handleClick = () => {
    
    // Convert the university name to a URL-friendly format
    
    
    const universitySlug = universityName
      .replace(/,/g, "") // Remove commas
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .toLowerCase(); // Convert to lowercase
    const courseSlug = coursename
      .replace(/,/g, "") // Remove commas
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .toLowerCase(); // Convert to lowercase

      const subSlug = subjectName
      .replace(/,/g, "") // Remove commas
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .toLowerCase(); // Convert to lowercas
      const yearSlug = name
      .replace(/,/g, "") // Remove commas
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .toLowerCase(); // Convert to lowercas

    // Navigate to /universityname/course
    router.push(`/pyq/${encodeURIComponent(universitySlug)}/${courseSlug}/${subSlug}/${yearSlug}/download`);
  };

  return (
    <div className={styles.card}>
    <h2 className={styles.title}>{name}</h2>
    <div className={styles.buttonContainer}>
      <button onClick={handleClick}><Eye /></button>
      <button><Download /></button>
    </div>
  </div>
  );
};

const YearMain = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const selectedSubject = params.subject;
  
  const handleClick = () => {
    router.back()
  }

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setLoading(true);
        const universityName = decodeURIComponent(params.universityname.replace(/-/g, " "));
        const courseName = decodeURIComponent(params.coursename.replace(/-/g, " "));
        const subjectName = decodeURIComponent(selectedSubject.replace(/-/g, " "));
        
        const yearsData = await getYearsForUniversityCourseSubject(universityName, courseName, subjectName);
        setYears(yearsData);
      } catch (error) {
        console.error('Error fetching years:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [selectedSubject, params.universityname, params.coursename]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="bg-white h-full md:mb-20 mb-5">
      <div className="">
        <div className="flex flex-col md:flex-row justify-start items-center mt-5 mx-4 gap-5">
          <button className="px-3 py-3 bg-custom-gradient rounded-3xl text-white text-sm">
            Download All Papers
          </button>
          <button onClick={handleClick} className="px-3 py-3 border-2 border-[#FE6B8B] rounded-3xl text-[#FE6B8B] text-sm">
            Search another subject
          </button>
        </div>
        {years.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 py-8 bg-white">
            {years.map((year, index) => (
              <YearCards key={index} name={year} universityName={params.universityname} coursename={params.coursename} subjectName={params.subject} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Years Available</h3>
              <p className="text-gray-500">No years found for this subject.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YearMain;