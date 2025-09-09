"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Eye, ArrowLeft, FileText, Image as ImageIcon } from "lucide-react";
import { getPYQPapers } from "@/services/pyqService";
import SpinnerLoader from "@/components/spinner/SpinnerLoader";
import Viewer from "@/components/PYQ/Viewer";

const DownloadPage = () => {
  const params = useParams();
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const universityName = decodeURIComponent(params.universityname.replace(/-/g, " "));
        const courseName = decodeURIComponent(params.coursename.replace(/-/g, " "));
        const subjectName = decodeURIComponent(params.subject.replace(/-/g, " "));
        const year = decodeURIComponent(params.year);

        const papersData = await getPYQPapers({
          universityName,
          courseName,
          subject: subjectName,
          year: parseInt(year)
        });
        
        setPapers(papersData);
      } catch (error) {
        console.error('Error fetching papers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [params]);

  const handleDownload = (paper) => {
    // Prevent default event if called from an event handler
    // and direct download using S3 link
    if (window.event) {
      window.event.preventDefault();
      window.event.stopPropagation();
    }
    const link = document.createElement('a');
    link.href = paper.fileUrl;
    link.download = paper.fileName || '';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (paper) => {
    setSelectedPaper(paper);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedPaper(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (paperType) => {
    return paperType === 'pdf' ? <FileText className="w-6 h-6 text-red-500" /> : <ImageIcon className="w-6 h-6 text-blue-500" />;
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mx-[200px]">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {decodeURIComponent(params.universityname.replace(/-/g, " "))}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {decodeURIComponent(params.coursename.replace(/-/g, " "))} - {decodeURIComponent(params.subject.replace(/-/g, " "))} - {decodeURIComponent(params.year.replace(/-/g, " "))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:mx-[200px]">
          {papers.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Papers ({papers.length})
                </h2>
                
                <div className="grid gap-4">
                  {papers.map((paper, index) => (
                    <div
                      key={paper._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getFileIcon(paper.paperType)}
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {paper.examName}
                            </h3>
                            <div className="text-sm text-gray-500 space-y-1">
                              <p>University: {paper.universityName}</p>
                              <p>Course: {paper.courseName}</p>
                              <p>Subject: {paper.subject}</p>
                              <p>Year: {paper.year}</p>
                              {paper.monthSession && <p>Session: {paper.monthSession}</p>}
                              {paper.paperCode && <p>Paper Code: {paper.paperCode}</p>}
                              {paper.examDuration && <p>Duration: {paper.examDuration}</p>}
                              {paper.maxMarks && <p>Max Marks: {paper.maxMarks}</p>}
                              {paper.paperSource && <p>Source: {paper.paperSource}</p>}
                              <p>File Size: {formatFileSize(paper.fileSize)}</p>
                              <p>Type: {paper.paperType.toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(paper)}
                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={e => { e.preventDefault(); e.stopPropagation(); handleDownload(paper); }}
                            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <FileText className="w-full h-full" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Papers Available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No papers found for the selected criteria.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.back()}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Go Back
                  </button>
                </div>
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

export default DownloadPage;