import React from "react";
import { Link } from "react-router-dom";
import { FiStar, FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  // console.log(product);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden shrink-0 p-2 sm:p-3 m-2 sm:m-4 rounded-xl sm:rounded-2xl">
        <img
          src={
            (product.media || []).find((m) => m.type === "IMAGE")?.url ||
            "https://images.unsplash.com/photo-1625228752485-f5036545c3c1?auto=format&fit=crop&q=80&w=800"
          }
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            product.category?.slug === "cow-products"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-indigo-100 text-indigo-850"
          }`}
        >
          {product.category?.name || "Uncategorized"}
        </span>
      </div>

      <div className="px-3 sm:px-6 flex-grow flex flex-col justify-between pb-3">
        <div>
          {/* <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-amber-400">
              <FiStar className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-stone-700">
              {product.averageRating || 5.0}
            </span>
            <span className="text-stone-300 text-xs">|</span>
            <span className="text-xs text-stone-400">
              {product.reviewCount || 0} {t("reviews")}
            </span>
          </div> */}

          <h3 className="font-display font-semibold text-stone-850 text-sm sm:text-base md:text-lg mb-1 sm:mb-2 leading-tight group-hover:text-secondary transition-colors line-clamp-2">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>

          <div className="flex items-center justify-between gap-2 pb-1">
            {product?.variants?.map((variant, index) => {
              return (
                <div key={index} className="border border-primary-light rounded-full px-1">
                  <p className="text-[12px] font-semibold">{variant?.weight}</p>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] sm:text-xs text-stone-500 line-clamp-2 leading-relaxed mb-2 sm:mb-4">
            {product.shortDescription || product.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
          <div>
            <span className="text-base sm:text-xl font-bold text-primary-dark">
              ₹
              {product.variants && product.variants.length > 0
                ? [...product.variants].sort((a, b) => a.price - b.price)[0]
                    .price
                : 0}
            </span>
          </div>
          <Link
            to={`/products/${product.id}`}
            className="flex items-center w-full justify-center gap-1.5 sm:gap-2 bg-primary hover:bg-primary-light text-white font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 focus:outline-hidden text-xs sm:text-sm"
          >
            <FaShoppingCart className="w-4 h-4" />
            <span>{t("shopNow")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
