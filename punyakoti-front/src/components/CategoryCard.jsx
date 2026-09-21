import React from "react";
import { Link } from "react-router-dom";
import * as GiIcons from "react-icons/gi";
import { FiArrowRight } from "react-icons/fi";

const CategoryCard = ({ category }) => {
  const IconComponent = GiIcons[category.icon] || GiIcons.GiCow;

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative rounded-3xl overflow-hidden border h-full border-stone-200/50 shadow-sm flex flex-col justify-end p-3 md:p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-stone-900 z-0">
        <img
          src={category?.image || "https://m.media-amazon.com/images/I/61GxNUfKo-L._SX425_PIbundle-2,TopRight,0,0_AA425SH20_.jpg"}
          alt={category?.name}
          className="w-full h-full object-contain opacity-60 group-hover:scale-105 transition-transform duration-500 bg-white"
          loading="lazy"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent"></div>
      </div>

      {/* Card Content */}
      <div className="relative z-10 text-white flex flex-col items-baseline">
        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-1">
          <IconComponent className="w-7 h-7 text-secondary" />
        </div>
        <h3 className="font-display font-bold text-lg md:text-xl text-stone-100">
          {category.name}
        </h3>
        {/* <p className="text-xs text-stone-300 leading-relaxed max-w-xs">
          {category.description}
        </p> */}
        {/* <div className="flex items-center gap-1.5 pt-2 text-xs font-semibold text-secondary group-hover:underline">
          <span>Explore Products</span>
          <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div> */}
      </div>
    </Link>
  );
};

export default CategoryCard;
