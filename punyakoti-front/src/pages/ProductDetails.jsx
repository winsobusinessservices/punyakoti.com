import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import { reviewApi } from "../api/reviewApi";
import { orderApi } from "../api/orderApi";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { FiStar, FiShoppingCart, FiCheckCircle } from "react-icons/fi";
import Loader from "../components/Loader";
import VideoPlayer from "../components/VideoPlayer";
import QuantitySelector from "../components/QuantitySelector";
import Breadcrumb from "../components/Breadcrumb";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addToCart } = useCart();

  const {
    data: product,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductById(id),
  });

  // Media states
  const [activeMedia, setActiveMedia] = useState({ type: "video", url: "" }); // default to video first
  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const productImages = product
    ? (product.media || []).filter((m) => m.type === "IMAGE").map((m) => m.url)
    : [];
  if (productImages.length === 0) {
    productImages.push(
      "https://images.unsplash.com/photo-1625228752485-f5036545c3c1?auto=format&fit=crop&q=80&w=800",
    );
  }
  const productVideo = product
    ? (product.media || []).find((m) => m.type === "VIDEO")?.url
    : null;
  const productVariants = product?.variants
    ? [...product.variants].sort((a, b) => a.price - b.price)
    : [];
  const productStock = product?.variants
    ? product.variants.reduce((s, v) => s + (v.stock || 0), 0)
    : 0;
  const productBenefits = product?.benefits
    ? product.benefits
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : ["Preservative free", "Rich organic fats"];
  const productIngredients = product?.ingredients
    ? product.ingredients
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  useEffect(() => {
    if (product) {
      if (productVariants.length > 0 && !selectedWeight) {
        setSelectedWeight(
          productVariants[1]?.weight || productVariants[0].weight,
        );
      }
      if (productVideo && !activeMedia.url) {
        setActiveMedia({ type: "video", url: productVideo });
      } else if (productImages.length > 0 && !activeMedia.url) {
        setActiveMedia({ type: "image", url: productImages[0] });
      }
    }
  }, [product]);

  if (loading) return <Loader type="full" />;
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-stone-850 mb-4">
          {error ? error.message : "Product Not Found"}
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  // Calculate current unit price based on selected weight offset
  const selectedWeightOpt =
    productVariants.find((opt) => opt.weight === selectedWeight) ||
    productVariants[0];
  const currentPrice = selectedWeightOpt?.price || 0;

  const handleAddToCart = () => {
    // Need to pass the weight string that Cart expects
    addToCart(product, selectedWeight, quantity);
    toast.success(
      `${product.name} (${selectedWeightOpt?.weight}) added to cart.`,
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 text-left">
      <Breadcrumb
        items={[
          { label: t("products"), path: "/products" },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Media Viewers */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Media window */}
          <div className="w-full">
            {activeMedia.type === "video" ? (
              <VideoPlayer
                url={activeMedia.url}
                controls={true}
                autoPlay={true}
                mutate={false}
                className="shadow-lg"
              />
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-3xl border border-stone-200 bg-white">
                <img
                  src={activeMedia.url}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            )}
          </div>

          {/* Media gallery list (thumbnails) */}
          <div className="flex gap-3 overflow-x-auto py-2 shrink-0">
            {productVideo && (
              <button
                onClick={() =>
                  setActiveMedia({ type: "video", url: productVideo })
                }
                className={`relative w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-stone-900 shrink-0 transition-all ${
                  activeMedia.type === "video"
                    ? "border-primary scale-98 shadow-md"
                    : "border-stone-200 opacity-70 hover:opacity-100"
                }`}
                aria-label="View product video"
              >
                <img
                  src={productImages[0]}
                  alt="Video cover"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <FiStar className="w-6 h-6 fill-current text-secondary" />
                </div>
              </button>
            )}

            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveMedia({ type: "image", url: img })}
                className={`w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-white transition-all ${
                  activeMedia.type === "image" && activeMedia.url === img
                    ? "border-primary scale-98 shadow-md"
                    : "border-stone-200 opacity-70 hover:opacity-100"
                }`}
                aria-label={`View product image ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`Gallery item ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Buying Options & Spec tabs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-850 m-0 leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-1.5 text-sm">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.averageRating || 5) ? "fill-amber-400" : "text-stone-250"}`}
                  />
                ))}
              </div>
              <span className="font-bold text-stone-700">
                {product.averageRating || 5.0}
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-stone-500 font-medium">
                {product.reviewCount || 0} verified reviews
              </span>
            </div>
          </div>

          {/* Dynamic Pricing */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Pricing for selected weight
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-primary-dark">
                ₹{currentPrice}
              </span>
            </div>
            {productStock > 0 ? (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                In Stock ({productStock} units left)
              </span>
            ) : (
              <span className="text-xs bg-rose-100 text-rose-800 px-3 py-1 rounded-full font-bold">
                Out of Stock
              </span>
            )}
          </div>

          {/* Weight selector */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Select Weight Option
            </span>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {productVariants.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedWeight(opt.weight)}
                  className={`flex-1 py-3 px-4 border-2 rounded-xl text-center transition-all ${
                    selectedWeight === opt.weight
                      ? "border-primary bg-primary/5 text-primary-dark font-bold"
                      : "border-stone-250 hover:border-stone-400 text-stone-600 font-semibold text-sm"
                  }`}
                >
                  <span className="block text-sm">{opt.weight}</span>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {opt.price >= productVariants[0].price ? "+" : ""}₹
                    {opt.price - productVariants[0].price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Buy Quantity & Add to Cart */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Quantity
              </span>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={product.stock}
              />
            </div>

            <div className="flex-grow pt-5">
              <button
                onClick={handleAddToCart}
                disabled={productStock === 0}
                className="w-full h-11 flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-light disabled:bg-stone-300 text-white font-bold rounded-xl shadow-lg transition-all active:scale-98 focus:outline-hidden"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>{t("addToCart")}</span>
              </button>
            </div>
          </div>
        </div>
        {/* Benefits Bullet points */}
        <div className="lg:col-span-12 space-y-6">
          <div className="space-y-2.5 pt-4 border-t border-stone-200">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
              {t("benefits")}
            </span>
            <ul className="space-y-2">
              {productBenefits.map((ben, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-xs sm:text-sm text-stone-600 items-start"
                >
                  <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TABS (Description, Usage, Ingredients) */}
          <div className="space-y-4 pt-6 border-t border-stone-200">
            {/* Tab Headers */}
            <div className="flex border-b border-stone-200 gap-3 sm:gap-6 overflow-x-auto hide-scrollbar">
              {["description", "usage", "ingredients", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all relative ${
                    activeTab === tab
                      ? "text-primary"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {tab === "description"
                    ? t("description")
                    : tab === "usage"
                      ? t("usage")
                      : tab === "ingredients"
                        ? t("ingredients")
                        : "Reviews"}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="text-xs sm:text-sm text-stone-500 leading-relaxed min-h-[80px]">
              {activeTab === "description" && <p>{product.description}</p>}
              {activeTab === "usage" && (
                <p>
                  {product.usageInstructions ||
                    "Consume as seasoning or cook directly."}
                </p>
              )}
              {activeTab === "ingredients" && (
                <ul className="list-disc pl-5 space-y-1">
                  {productIngredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              )}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Reviews List */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="border-b border-stone-100 pb-4 last:border-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-bold text-stone-800">
                              {rev.userName || "Anonymous"}
                            </div>
                            <div className="flex text-amber-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400" : "text-stone-200"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-stone-600">{rev.comment}</p>
                          {rev.videoUrl && (
                            <a
                              href={rev.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-xs mt-2 inline-block"
                            >
                              View attached video
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No reviews yet. Be the first to review this product!</p>
                  )}

                  {/* Review Form - Needs auth state */}
                  <ReviewForm productId={product.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewForm = ({ productId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const { data: hasPurchased } = useQuery({
    queryKey: ["checkPurchase", productId],
    queryFn: () => orderApi.checkPurchase(productId),
    enabled: !!user,
  });

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: (data) => reviewApi.createReview(data.payload, data.file),
    onSuccess: () => {
      toast.success("Review submitted for approval!");
      setRating(5);
      setComment("");
      setVideoFile(null);
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Failed to submit review";
      toast.error(errorMessage);
    },
  });

  if (!user) {
    return (
      <div className="bg-stone-50 p-4 rounded-xl text-center border border-stone-200 mt-4">
        <p className="text-sm font-medium text-stone-600 mb-2">
          Please log in to write a review.
        </p>
      </div>
    );
  }

  if (hasPurchased === false) {
    return (
      <div className="bg-stone-50 p-4 rounded-xl text-center border border-stone-200 mt-4">
        <p className="text-sm font-medium text-stone-600 mb-2">
          You can only review products that you have purchased and received.
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReview({ payload: { productId, rating, comment }, file: videoFile });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4 mt-6"
    >
      <h4 className="font-bold text-stone-800 text-sm">Write a Review</h4>

      <div>
        <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-hidden"
            >
              <FiStar
                className={`w-5 h-5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
          Comment
        </label>
        <textarea
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          className="w-full bg-white border border-stone-250 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:border-primary"
        ></textarea>
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-600 uppercase mb-1">
          Attach Video (Optional)
        </label>
        <input
          type="file"
          accept="video/mp4,video/webm"
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ProductDetails;
