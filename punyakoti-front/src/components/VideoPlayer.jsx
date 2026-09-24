import React from "react";

import ReactPlayer from "react-player";

const VideoPlayer = ({
  url,
  poster,
  className = "",
  controls = false,
  autoPlay = true,
  loop = true,
  muted = true,
}) => {
  if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
    // Extract video ID
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("/live/")) {
      videoId = url.split("/live/")[1].split("?")[0];
    } else if (url.includes("/shorts/")) {
      videoId = url.split("/shorts/")[1].split("?")[0];
    } else if (url.includes("/embed/")) {
      videoId = url.split("/embed/")[1].split("?")[0];
    }

    if (videoId) {
      const src = `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${videoId}`;
      return (
        <div
          className={`relative overflow-hidden rounded-3xl shadow-md border border-stone-200 bg-black aspect-video w-full flex items-center justify-center ${className}`}
        >
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={src}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  }

  // Extract YouTube ID if it's a YouTube URL to use as poster if none provided
  let light = poster;
  if (
    !poster &&
    url &&
    (url.includes("youtube.com") || url.includes("youtu.be"))
  ) {
    light = !autoPlay; // only use light if not autoPlaying
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
      />
    </div>
  );
};

export default VideoPlayer;
