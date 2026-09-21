import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ url, poster, className = "" }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-md border border-stone-200 bg-black aspect-video w-full ${className}`}
    >
      {/* <ReactPlayer
        url={url}
        controls
        playing={true}
        width="100%"
        height="100%"
        light={poster || false} // Show thumbnail first for faster initial load
        playIcon={
          <div
            className="w-16 h-16 rounded-full bg-secondary text-primary-dark shadow-2xl flex items-center justify-center hover:scale-115 active:scale-95 transition-all cursor-pointer"
            aria-label="Play video"
          >
            <span className="ml-1.5 border-y-[10px] border-y-transparent border-l-[16px] border-l-primary-dark"></span>
          </div>
        }
      /> */}
      <video
        src={url}
        // controls
        autoPlay
        loop
        muted
        className="h-full w-full"
      ></video>
    </div>
  );
};

export default VideoPlayer;
