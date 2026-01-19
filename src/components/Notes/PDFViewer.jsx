"use client";

const PDFViewer = ({ url }) => {
  return (
    <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: "600px" }}>
      <iframe
        src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer;
