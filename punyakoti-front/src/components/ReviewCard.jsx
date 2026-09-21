import React from "react";
import VideoPlayer from "./VideoPlayer";
import { FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review, index = 0 }) => {
  const stars = Array.from({ length: 5 });

  // Exact mockup image card background colors and quote circle themes
  const themes = [
    {
      cardBg: "bg-[#FFF9E6]", // Card 1: Warm light yellow
      quoteBg: "bg-[#F5B041]", // Yellowish-Orange quote circle
    },
    {
      cardBg: "bg-[#EBF5FB]", // Card 2: Light sky blue
      quoteBg: "bg-[#2980B9]", // Blue quote circle
    },
    {
      cardBg: "bg-[#FDEDEC]", // Card 3: Light rose pink
      quoteBg: "bg-[#EC7063]", // Coral pink quote circle
    },
  ];

  const currentTheme = themes[index % themes.length];

  // Map locations to match mockup user locations
  const locations = [
    "Bengaluru, Karnataka",
    "Mysuru, Karnataka",
    "Tumakuru, Karnataka",
    "Hubballi, Karnataka",
  ];
  const userLocation = review.location || locations[index % locations.length];

  return (
    <div
      className={`flex flex-col justify-between h-full rounded-[32px] p-8 border-[6px] border-white shadow-[0_12px_36px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-300 relative group min-h-[300px] ${currentTheme.cardBg}`}
    >
      <div>
        {/* Top Row: Quote Badge + Stars horizontally aligned */}
        <div className="flex gap-5 items-center mb-6">
          {/* Circular Quote Badge */}
          <div
            className={`w-11 h-11 rounded-full text-white flex justify-center items-center text-xl font-serif select-none leading-none shadow-xs ${currentTheme.quoteBg}`}
          >
            <FaQuoteLeft />
          </div>

          {/* Star Rating list */}
          <div
            className="flex gap-0.5"
            aria-label={`Rating: ${review.rating} out of 5 stars`}
          >
            {stars.map((_, i) => (
              <span
                key={i}
                className={`text-xl leading-none ${
                  i < review.rating ? "text-[#F5B041]" : "text-stone-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Video review (embedded inline if video is present) */}
        {review.videoUrl && (
          <div className="mb-5 relative w-full overflow-hidden select-none">
            <VideoPlayer
              url={review.videoUrl}
              className="rounded-2xl border-0 shadow-xs"
            />
          </div>
        )}

        {/* Testimonial text block */}
        <p className="text-stone-700 font-sans text-sm sm:text-[15px] leading-relaxed text-left wrap-break-word">
          {review.comment}
        </p>
      </div>

      {/* User Information Footer */}
      <div className="mt-8 pt-5 border-t border-stone-200/40 flex items-center gap-3">
        <img
          src={`https://ui-avatars.com/api/?name=${review.userName || 'Anonymous'}&background=random`}
          alt={review.userName || 'Anonymous'}
          className="w-11 h-11 rounded-full object-cover border border-stone-200/80 shadow-xs"
        />
        <div className="text-left">
          <h4 className="font-display font-extrabold text-stone-850 text-xs sm:text-sm leading-none">
            {review.userName || 'Anonymous'}
          </h4>
          <span className="text-[10px] text-stone-400 font-semibold mt-1.5 inline-block">
            {userLocation}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
