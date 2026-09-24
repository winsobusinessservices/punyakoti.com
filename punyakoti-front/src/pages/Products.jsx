import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import { categoryApi } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Breadcrumb from "../components/Breadcrumb";

const Products = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["products", activeCategory, searchQuery],
    queryFn: () => productApi.getProducts({ categoryId: activeCategory, search: searchQuery }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
  });

  const handleCategoryChange = (categoryId) => {
    setSearchParams((prev) => {
      if (categoryId) {
        prev.set("category", categoryId);
      } else {
        prev.delete("category");
      }
      return prev;
    });
  };

  const handleSearchChange = (val) => {
    setSearchParams((prev) => {
      if (val) {
        prev.set("search", val);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  const filteredProducts = products;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 text-left">
      <Breadcrumb items={[{ label: t("products") }]} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-stone-200">
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-850 m-0">
            {t("allProducts")}
          </h1>
          <p className="text-xs md:text-sm text-stone-500">
            Enjoy premium, traditional dairy goodness prepared under absolute
            hygiene.
          </p>
        </div>

        {/* Search and Filter Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search product catalogue..."
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto hide-scrollbar pb-2">
        <button
          onClick={() => handleCategoryChange("")}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs transition-all shadow-xs whitespace-nowrap shrink-0 ${
            activeCategory === ""
              ? "bg-primary text-white"
              : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(String(cat.id))}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-xs transition-all shadow-xs whitespace-nowrap shrink-0 ${
              activeCategory === String(cat.id)
                ? "bg-primary text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product List Grid */}
      {loading ? (
        <Loader type="skeleton-card" count={3} />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Products Match Your Search"
          message="Try adjusting filters, or clearing the search query to see catalog products."
          actionText="Clear Filters"
          onAction={() => {
            handleSearchChange("");
            handleCategoryChange("");
          }}
        />
      )}
    </div>
  );
};

export default Products;
