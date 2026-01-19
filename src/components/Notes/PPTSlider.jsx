"use client";

const PPTSlider = ({ slides }) => {
  if (!slides || slides.length === 0) {
    return <div className="text-gray-500">No presentation available</div>;
  }

  const slide = slides[0]; // For now, display first PPT

  return (
    <div className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: "600px" }}>
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(slide.url)}`}
        className="w-full h-full"
        title="PowerPoint Viewer"
        frameBorder="0"
      />
    </div>
  );
};

export default PPTSlider;
