
"use client";

// components/UniversalVideoPlayer.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";

// Import all ReactPlayer supported players
import ReactPlayerYouTube from "react-player/youtube";
import ReactPlayerFile from "react-player/file";

const UniversalVideoPlayer = ({
  url,
  width = "100%",
  height = "100%",
  containerStyle = {},
  controls = true,
  light = false,
  playing = false,
  volume = 0.8,
  muted = false,
  playbackRate = 1.0,
  loop = false,
  pip = false,
  stopOnUnmount = true,
  showDownloadButton = true,
  onReady,
  onStart,
  onPlay,
  onPause,
  onEnded,
  onError,
}) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(playing);
  const [playerConfig, setPlayerConfig] = useState({});
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Helper functions to determine URL type and format
  const isYoutubeUrl = (url) => {
    return (
      url &&
      (url.includes("youtube.com") ||
        url.includes("youtu.be") ||
        url.includes("youtube-nocookie.com"))
    );
  };

  const isGoogleDriveUrl = (url) => {
    return url && url.includes("drive.google.com");
  };

  const isPikpakUrl = (url) => {
    return url && url.includes("pikpak.com");
  };

  const formatGoogleDriveUrl = (url) => {
    // Extract file ID from Google Drive URL
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (!fileIdMatch) return url;

    const fileId = fileIdMatch[0];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  };

  const getFileType = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    if (["mp4", "webm", "ogg", "mov"].includes(extension)) {
      return "video";
    } else if (["mp3", "wav", "ogg"].includes(extension)) {
      return "audio";
    }
    return "unknown";
  };

  useEffect(() => {
    if (!url) {
      setError("No video URL provided");
      setIsLoading(false);
      return;
    }

    try {
      let formattedUrl = url;
      let config = {};

      // Process YouTube URLs
      if (isYoutubeUrl(url)) {
        config = {
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              autoplay: playing ? 1 : 0,
            },
          },
        };
      }
      // Process Google Drive URLs
      else if (isGoogleDriveUrl(url)) {
        formattedUrl = formatGoogleDriveUrl(url);
      }
      // Process PikPak or other URLs
      else if (isPikpakUrl(url) || url.startsWith("http")) {
        // Most direct links should work with the file player
        config = {
          file: {
            forceVideo: getFileType(url) === "video",
            forceAudio: getFileType(url) === "audio",
            attributes: {
              crossOrigin: "anonymous",
            },
          },
        };
      }

      setVideoUrl(formattedUrl);
      setPlayerConfig(config);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error processing video URL:", err);
      setError("Failed to process video URL");
      setIsLoading(false);
    }
  }, [url, playing]);

  const handleToggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(containerRef.current);
    }
  };

  const handleDownload = () => {
    // Only attempt download for non-YouTube URLs
    if (!isYoutubeUrl(videoUrl)) {
      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = videoUrl.split("/").pop() || "video";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("YouTube videos cannot be downloaded directly from the player.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        Loading video player...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="video-player-container relative overflow-hidden"
      style={{
        width: width,
        height: height,
        aspectRatio: "16 / 9",
        ...containerStyle,
        justifyContent: "center",
        display: "flex",
        marginTop: 20,
      }}
    >
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="100%"
        playing={isPlaying}
        controls={controls}
        light={light}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        loop={loop}
        pip={pip}
        stopOnUnmount={stopOnUnmount}
        config={playerConfig}
        onReady={(player) => {
          if (onReady) onReady(player);
        }}
        onStart={() => {
          if (onStart) onStart();
        }}
        onPlay={() => {
          setIsPlaying(true);
          if (onPlay) onPlay();
        }}
        onPause={() => {
          setIsPlaying(false);
          if (onPause) onPause();
        }}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onError={(e) => {
          console.error("Player error:", e);
          setError("Failed to play video");
          if (onError) onError(e);
        }}
      />

      {showDownloadButton && !isYoutubeUrl(videoUrl) && (
        <button
          onClick={handleDownload}
          className="download-button absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded z-10 text-sm"
          style={{ display: controls ? "none" : "block" }}
        >
          Download
        </button>
      )}

      {!controls && (
        <div className="custom-controls absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center">
          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={handleToggleFullscreen}>Fullscreen</button>
        </div>
      )}
    </div>
  );
};

export default UniversalVideoPlayer;
