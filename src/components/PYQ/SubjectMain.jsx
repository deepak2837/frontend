"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import styles from './CollegeCard.module.css';
import { getSubjectsForUniversityAndCourse } from "@/services/pyqService";
import SpinnerLoader from "../spinner/SpinnerLoader";
const SubjectCards = ({ name, universityName,coursename }) => {
console.log(universityName,"uni");
const router = useRouter();

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

      const subSlug = name
      .replace(/,/g, "") // Remove commas
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .toLowerCase(); // Convert to lowercas

    // Navigate to /universityname/course
    router.push(`/pyq/${encodeURIComponent(universitySlug)}/${courseSlug}/${subSlug}/year`);
  };

  return (
    <div className={styles.card}
    onClick={handleClick}
    >
      <h2 className="text-lg font-bold text-gray-800">{name}</h2>
    </div>
  );
};

const SubjectMain = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const params = useParams();
  const selectedCourse = params.coursename;

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const universityName = decodeURIComponent(params.universityname.replace(/-/g, " "));
        const courseName = decodeURIComponent(selectedCourse.replace(/-/g, " "));
        
        const subjectsData = await getSubjectsForUniversityAndCourse(universityName, courseName);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedCourse, params.universityname]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="bg-white h-full md:mb-20 mb-5 lg:mx-[200px]">
      <div className="">
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 py-8 bg-white">
            {subjects.map((subject, index) => (
              <SubjectCards key={index} name={subject} universityName={params.universityname} coursename={selectedCourse} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Subjects Available</h3>
              <p className="text-gray-500">No subjects found for this course.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectMain;