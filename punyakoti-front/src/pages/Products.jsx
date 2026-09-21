import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Breadcrumb from "../components/Breadcrumb";

const Products = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getProducts,
  });

  const handleCategoryChange = (categorySlug) => {
    if (categorySlug) {
      setSearchParams({ category: categorySlug });
    } else {
      setSearchParams({});
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = activeCategory
      ? prod.category?.slug === activeCategory
      : true;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <Breadcrumb items={[{ label: t("products") }]} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-stone-200">
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-3xl text-stone-850 m-0">
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
            onChange={setSearchQuery}
            placeholder="Search product catalogue..."
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => handleCategoryChange("")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-xs ${
            activeCategory === ""
              ? "bg-primary text-white"
              : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
          }`}
        >
          All Categories
        </button>
        <button
          onClick={() => handleCategoryChange("cow-products")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-xs ${
            activeCategory === "cow-products"
              ? "bg-primary text-white"
              : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
          }`}
        >
          {t("cowProducts")}
        </button>
        <button
          onClick={() => handleCategoryChange("buffalo-products")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-xs ${
            activeCategory === "buffalo-products"
              ? "bg-primary text-white"
              : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
          }`}
        >
          {t("buffaloProducts")}
        </button>
      </div>

      {/* Product List Grid */}
      {loading ? (
        <Loader type="skeleton-card" count={3} />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
            setSearchQuery("");
            handleCategoryChange("");
          }}
        />
      )}
    </div>
  );
};

export default Products;
