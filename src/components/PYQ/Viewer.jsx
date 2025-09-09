"use client";
import React, { useState, useEffect } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCw, ExternalLink } from "lucide-react";

const Viewer = ({ isOpen, onClose, paper }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfFailed, setPdfFailed] = useState(false);

  // Reset loading state when paper changes
  useEffect(() => {
    if (paper) {
      setIsLoading(true);
      setScale(1);
      setRotation(0);
      setPdfFailed(false);
    }
  }, [paper]);

  if (!isOpen || !paper) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = paper.fileUrl;
    link.download = paper.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const resetView = () => { setScale(1); setRotation(0); };

  const isPDF = paper.paperType === 'pdf';

  // Responsive modal: full screen on mobile, centered on desktop
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative pt-5 w-full flex items-center justify-center lg:mx-[200px]">
        {/* Modal container */}
        <div className="relative pt-12 bg-white rounded-lg shadow-xl w-full max-w-full flex flex-col">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 border-b">
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 truncate max-w-[60vw]">
                {paper.examName} - {paper.year}
              </h2>
              <span className="text-xs md:text-sm text-gray-500">{paper.paperType?.toUpperCase()}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={handleZoomOut} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded" title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs md:text-sm text-gray-600 min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
              <button onClick={handleZoomIn} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded" title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={handleRotate} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded" title="Rotate">
                <RotateCw className="w-4 h-4" />
              </button>
              <button onClick={resetView} className="px-2 py-1 text-xs md:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                Reset
              </button>
              <button onClick={handleDownload} className="flex items-center gap-1 px-3 py-2 text-xs md:text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button onClick={onClose} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded" title="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-auto">
            <div className="w-full h-full flex flex-col items-center justify-center">
              {isLoading && (
                <div className="flex flex-col items-center justify-center ">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                  <p className="text-gray-600 text-sm">Loading document...</p>
                </div>
              )}

              {/* PDF Viewer */}
              {isPDF && !pdfFailed && (
                <div className="w-full flex justify-center items-center" style={{ minHeight: "40vh" }}>
                  <div
                    className="w-full flex justify-center items-center"
                    style={{
                      maxWidth: "100vw",
                      maxHeight: "90vh",
                      overflow: "auto"
                    }}
                  >
                    <iframe
                      src={`${paper.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="border-0"
                      style={{
                        width: "100%",
                        maxWidth: "900px",
                        height: "75vh",
                        maxHeight: "85vh",
                        minHeight: "40vh",
                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                        transformOrigin: 'center center',
                        display: isLoading ? 'none' : 'block'
                      }}
                      title={paper.fileName}
                      onLoad={() => setIsLoading(false)}
                      onError={() => { setIsLoading(false); setPdfFailed(true); }}
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* PDF fallback */}
              {isPDF && pdfFailed && (
                <div className="flex flex-col items-center justify-center h-40">
                  <p className="text-gray-500 text-base mb-2">PDF could not be loaded.</p>
                  <button
                    onClick={() => window.open(paper.fileUrl, '_blank')}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open PDF in New Tab
                  </button>
                </div>
              )}

              {/* Image Viewer */}
              {!isPDF && (
                <div
                  className="w-full flex justify-center items-center"
                  style={{
                    maxWidth: "100vw",
                    maxHeight: "70vh",
                    overflow: "auto"
                  }}
                >
                  <img
                    src={paper.fileUrl}
                    alt={paper.fileName}
                    className="rounded shadow"
                    style={{
                      width: "auto",
                      maxWidth: "100%",
                      height: "auto",
                      maxHeight: "65vh",
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      display: isLoading ? 'none' : 'block'
                    }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs md:text-sm text-gray-600">
            <div>
              <span className="font-semibold">File:</span> {paper.fileName}
            </div>
            <div>
              <span className="font-semibold">Size:</span> {(paper.fileSize / 1024 / 1024).toFixed(2)} MB
            </div>
            <div>
              <span className="font-semibold">Source:</span> {paper.paperSource || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;