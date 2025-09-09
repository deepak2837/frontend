"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from './CollegeCard.module.css';
import { getCoursesForUniversity } from "@/services/pyqService";
import SpinnerLoader from "../spinner/SpinnerLoader";
const CourseCards = ({ name, universityName }) => {

  const router = useRouter();
  const handleClick = () => {
    // Convert the university name to a URL-friendly format
    const universitySlug = universityName
      .replace(/,/g, "") // Remove commas
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .toLowerCase(); // Convert to lowercase
    const courseSlug = name
      .replace(/,/g, "") // Remove commas
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .toLowerCase(); // Convert to lowercase

    // Navigate to /universityname/course
    router.push(`/pyq/${encodeURIComponent(universitySlug)}/${courseSlug}/subject`);
  };

  return (
    <div className={styles.card}
    onClick={handleClick}
    >
      <div className={styles.flexContainer}>
        <div  className={styles.imageContainer}>
          <Image src={"/college.png"} height={100} width={100} alt="Course Image" />
        </div>
        <h2 className={styles.title}>Course: {name}</h2>
      </div>
      <p className="text-gray-600 mt-2 hidden md:block">University: {universityName}</p>
    </div>
  );
};

const CourseMain = () => {
  const { universityname } = useParams();
  const [visibleCourses, setVisibleCourses] = useState(9);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const universityName = decodeURIComponent(universityname.replace(/-/g, " "));
        setSelectedUniversity({ universityName });
        
        const coursesData = await getCoursesForUniversity(universityName);
        setAllCourses(coursesData);
        setCourses(coursesData.slice(0, visibleCourses));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [universityname, visibleCourses]);

  const loadMoreCourses = () => {
    const newVisibleCount = visibleCourses + 9;
    setVisibleCourses(newVisibleCount);
    setCourses(allCourses.slice(0, newVisibleCount));
  };

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
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 py-8 bg-white">
              {courses.map((course, index) => (
                <CourseCards key={index} name={course} universityName={selectedUniversity?.universityName} />
              ))}
            </div>
            {courses.length < allCourses.length && (
              <div className="flex justify-center my-8">
                <button
                  className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600 focus:outline-none"
                  onClick={loadMoreCourses}
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Courses Available</h3>
              <p className="text-gray-500">No courses found for this course.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMain;