import React from "react";
import * as GiIcons from "react-icons/gi";

const WhyChooseCard = ({ icon, title, description, index = 0 }) => {
  const IconComponent = GiIcons[icon] || GiIcons.GiCow;

  // Distinct color palettes matching Gau Sampurna theme & agricultural vibe
  const styles = [
    {
      iconBg: "bg-white/95 text-emerald-700",
      textMuted: "text-emerald-100",
    },
    {
      iconBg: "bg-white/95 text-primary",
      textMuted: "text-blue-100",
    },
    {
      iconBg: "bg-white/95 text-amber-700",
      textMuted: "text-amber-100",
    },
    {
      iconBg: "bg-white/95 text-sky-650",
      textMuted: "text-sky-100",
    },
  ];

  const currentStyle = styles[index % styles.length];

  return (
    <div
      className={`rounded-3xl p-6 transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1.5 hover:shadow-2xl border-0`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex shrink-0 items-center justify-center md:mb-5 mb-1 transition-all duration-300 group-hover:rotate-6 shadow-md ${currentStyle.iconBg}`}
      >
        <IconComponent className="w-8 h-8" />
      </div>
      <span className="">
        <h3 className="font-display font-extrabold text-base md:text-lg mb-2 text-white leading-tight">
          {title}
        </h3>
        <p
          className={`text-xs md:text-sm leading-relaxed font-medium text-white/80`}
        >
          {description}
        </p>
      </span>
    </div>
  );
};

export default WhyChooseCard;
