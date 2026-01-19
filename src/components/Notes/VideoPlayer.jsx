"use client";

const VideoPlayer = ({ video }) => {
  if (!video) {
    return <div className="text-gray-500">No video available</div>;
  }

  // YouTube video
  if (video.isYouTube && video.youtubeId) {
    return (
      <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video"
        />
      </div>
    );
  }

  // Uploaded video
  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <video
        controls
        className="w-full h-auto"
        preload="metadata"
      >
        <source src={video.url} type="video/mp4" />
        <source src={video.url} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
