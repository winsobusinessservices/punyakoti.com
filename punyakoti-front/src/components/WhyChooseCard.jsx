import React from "react";

const WhyChooseCard = ({ title, description, index = 0 }) => {
  const formattedNumber = String(index + 1).padStart(2, "0");

  return (
    <div className="group flex flex-col text-center items-center">
      {/* Number with cut-off effect */}
      <div className="h-[36px] md:h-[42px] overflow-hidden mb-6 flex justify-center w-full relative">
        <span className="text-[64px] md:text-[80px] font-display font-black text-gray-300 group-hover:text-primary transition-colors duration-300 block leading-[1]">
          {formattedNumber}
        </span>
      </div>

      <h3 className="font-display font-bold text-sm md:text-base mb-3 text-gray-900 leading-tight transition-colors group-hover:text-primary">
        {title}
      </h3>
      <p className="text-[11px] md:text-xs leading-relaxed text-gray-500 max-w-[200px]">
        {description}
      </p>
    </div>
  );
};

export default WhyChooseCard;
