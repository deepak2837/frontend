"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Download, Eye } from "lucide-react";
import styles from './Year.module.css';
import { getYearsForUniversityCourseSubject, getPYQPapers, getPYQPaperByDetails } from "@/services/pyqService";
import SpinnerLoader from "../spinner/SpinnerLoader";
import Viewer from "./Viewer";

const YearCards = ({ year, universityName, coursename, subjectName, onView, onDownload }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{year}</h2>
      <div className={styles.buttonContainer}>
        <button onClick={() => onView(year)}><Eye /></button>
        <button onClick={() => onDownload(year)}><Download /></button>
      </div>
    </div>
  );
};

const YearMain = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
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

  const handleView = async (year) => {
    try {
      const universityName = decodeURIComponent(params.universityname.replace(/-/g, " "));
      const courseName = decodeURIComponent(params.coursename.replace(/-/g, " "));
      const subjectName = decodeURIComponent(selectedSubject.replace(/-/g, " "));

      // Use new API to get a single paper
      const paper = await getPYQPaperByDetails({
        universityName,
        courseName,
        subject: subjectName,
        year: parseInt(year)
      });

      if (paper) {
        setSelectedPaper(paper);
        setIsViewerOpen(true);
      } else {
        alert('No papers found for this year');
      }
    } catch (error) {
      console.error('Error fetching paper:', error);
      alert('Error loading paper');
    }
  };

  const handleDownload = async (year) => {
    try {
      const universityName = decodeURIComponent(params.universityname.replace(/-/g, " "));
      const courseName = decodeURIComponent(params.coursename.replace(/-/g, " "));
      const subjectName = decodeURIComponent(selectedSubject.replace(/-/g, " "));

      // Use new API to get a single paper
      const paper = await getPYQPaperByDetails({
        universityName,
        courseName,
        subject: subjectName,
        year: parseInt(year)
      });

      if (paper) {
        const link = document.createElement('a');
        link.href = paper.fileUrl;
        link.download = paper.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('No papers found for this year');
      }
    } catch (error) {
      console.error('Error downloading paper:', error);
      alert('Error downloading paper');
    }
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedPaper(null);
  };

  const handleDownloadAllPapers = async () => {
    try {
      const universityName = decodeURIComponent(params.universityname.replace(/-/g, " "));
      const courseName = decodeURIComponent(params.coursename.replace(/-/g, " "));
      const subjectName = decodeURIComponent(selectedSubject.replace(/-/g, " "));
      
      // Get all papers for this subject
      const papers = await getPYQPapers({
        universityName,
        courseName,
        subject: subjectName
      });
      
      if (papers && papers.length > 0) {
        // Download each paper
        papers.forEach((paper, index) => {
          setTimeout(() => {
            const link = document.createElement('a');
            link.href = paper.fileUrl;
            link.download = `${paper.examName}_${paper.year}_${paper.fileName}`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, index * 1000); // Delay each download by 1 second
        });
        
        alert(`Downloading ${papers.length} papers. Downloads will start automatically.`);
      } else {
        alert('No papers found for this subject');
      }
    } catch (error) {
      console.error('Error downloading all papers:', error);
      alert('Error downloading papers');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white h-full md:mb-20 mb-5 lg:mx-[200px]">
        <div className="">
          <div className="flex flex-col md:flex-row justify-start items-center mt-5 mx-4 gap-5">
            <button onClick={handleDownloadAllPapers} className="px-3 py-3 bg-custom-gradient rounded-3xl text-white text-sm">
              Download All Papers
            </button>
            <button onClick={handleClick} className="px-3 py-3 border-2 border-[#FE6B8B] rounded-3xl text-[#FE6B8B] text-sm">
              Search another subject
            </button>
          </div>
          {years.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 py-8 bg-white">
              {years.map((year, index) => (
                <YearCards 
                  key={index} 
                  year={year} 
                  universityName={params.universityname} 
                  coursename={params.coursename} 
                  subjectName={params.subject}
                  onView={handleView}
                  onDownload={handleDownload}
                />
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

      {/* Viewer Modal */}
      <Viewer
        isOpen={isViewerOpen}
        onClose={closeViewer}
        paper={selectedPaper}
      />
    </>
  );
};

export default YearMain;