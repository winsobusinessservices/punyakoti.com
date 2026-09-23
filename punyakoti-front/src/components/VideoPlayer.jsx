import React from "react";

import ReactPlayer from "react-player";

const VideoPlayer = ({ 
  url, 
  poster, 
  className = "",
  controls = false,
  autoPlay = true,
  loop = true,
  muted = true
}) => {
  // Extract YouTube ID if it's a YouTube URL to use as poster if none provided
  let light = poster;
  if (!poster && url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
    light = true; // react-player will automatically fetch the thumbnail
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-md border border-stone-200 bg-black aspect-video w-full flex items-center justify-center ${className}`}
    >
      <ReactPlayer
        url={url}
        playing={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        width="100%"
        height="100%"
        light={light}
        className="absolute top-0 left-0"
        config={{
          youtube: {
            playerVars: { showinfo: 1 }
          }
        }}
      />
    </div>
  );
};

export default VideoPlayer;

