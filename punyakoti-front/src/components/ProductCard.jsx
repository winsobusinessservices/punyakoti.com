import React from "react";
import { Link } from "react-router-dom";
import { FiStar, FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full group hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-stone-50 shrink-0 p-8 border-b border-stone-200">
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

      {/* Product Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
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
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-stone-850 text-base md:text-lg mb-2 leading-tight group-hover:text-primary transition-colors">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
            {product.shortDescription}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider leading-none mb-1">
              Price starts at
            </span>
            <span className="text-lg font-bold text-primary-dark">
              ₹
              {product.variants && product.variants.length > 0
                ? [...product.variants].sort((a, b) => a.price - b.price)[0]
                    .price
                : 0}
            </span>
          </div>
          <Link
            to={`/products/${product.id}`}
            className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 focus:outline-hidden"
          >
            <span>{t("shopNow")}</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
