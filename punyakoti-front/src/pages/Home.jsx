import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

// Import CSS for Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import WhyChooseCard from "../components/WhyChooseCard";
import VideoPlayer from "../components/VideoPlayer";
import ReviewCard from "../components/ReviewCard";
import FAQAccordion from "../components/FAQAccordion";
import Loader from "../components/Loader";

import { productApi } from "../api/productApi";
import { reviewApi } from "../api/reviewApi";
import { faqApi } from "../api/faqApi";
import { whyChooseUsApi } from "../api/whyChooseUsApi";
import { categoryApi } from "../api/categoryApi";
import { howItWorksApi } from "../api/howItWorksApi";

const Home = () => {
  const { t } = useTranslation();

  const { data: prods = [], isLoading: isLoadingProds } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getProducts,
  });

  const { data: revs = [], isLoading: isLoadingRevs } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => reviewApi.getReviews(),
  });

  const { data: faqList = [], isLoading: isLoadingFaqs } = useQuery({
    queryKey: ["faqs"],
    queryFn: faqApi.getFaqs,
  });

  const { data: wcuList = [], isLoading: isLoadingWcu } = useQuery({
    queryKey: ["whyChooseUs"],
    queryFn: whyChooseUsApi.getAll,
  });

  const { data: categoriesList = [], isLoading: isLoadingCats } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
  });

  const { data: hiwList = [], isLoading: isLoadingHiw } = useQuery({
    queryKey: ["howItWorks"],
    queryFn: howItWorksApi.getAll,
  });

  const loading =
    isLoadingProds ||
    isLoadingRevs ||
    isLoadingFaqs ||
    isLoadingWcu ||
    isLoadingCats ||
    isLoadingHiw;
  const featuredProducts = prods.slice(0, 3);
  const customerReviews = revs.filter((r) => r.approved);

  // Stacked Category slider index
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [swipeStartX, setSwipeStartX] = useState(null);

  const handleTouchStart = (e) => {
    setSwipeStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (swipeStartX === null) return;
    const diffX = e.changedTouches[0].clientX - swipeStartX;
    const swipeThreshold = 40; // minimum swipe distance
    if (Math.abs(diffX) > swipeThreshold) {
      if (diffX > 0) {
        // Swipe Right -> show previous category
        setActiveCatIndex((prev) =>
          prev === 0 ? categoriesList.length - 1 : prev - 1,
        );
      } else {
        // Swipe Left -> show next category
        setActiveCatIndex((prev) =>
          prev === categoriesList.length - 1 ? 0 : prev + 1,
        );
      }
    }
    setSwipeStartX(null);
  };

  const handleMouseDown = (e) => {
    setSwipeStartX(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (swipeStartX === null) return;
    const diffX = e.clientX - swipeStartX;
    const swipeThreshold = 40;
    if (Math.abs(diffX) > swipeThreshold) {
      if (diffX > 0) {
        // Swipe Right -> show previous
        setActiveCatIndex((prev) =>
          prev === 0 ? categoriesList.length - 1 : prev - 1,
        );
      } else {
        // Swipe Left -> show next
        setActiveCatIndex((prev) =>
          prev === categoriesList.length - 1 ? 0 : prev + 1,
        );
      }
    }
    setSwipeStartX(null);
  };

  return (
    <div className="space-y-10 max-md:space-y-7 px-5">
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto">
        <Hero />
      </div>

      {/* Categories Section (Left side Blue Div + Right side Swippable Stack) */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 bg-[#BDE2EF] lg:grid-cols-12 gap-8 items-stretch border border-stone-200/80 rounded-3xl overflow-hidden shadow-xs">
          {/* Left blue div */}
          <div className="lg:col-span-5 text-white p-8 sm:p-12 flex flex-col justify-center text-left relative overflow-hidden">
            {/* Blurry glow shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
            <div className="relative z-10 space-y-4">
              <span className="text-xs uppercase tracking-wider font-extrabold text-secondary">
                Catalog Collections
              </span>
              <h2 className="text-2xl md:text-2xl font-display font-extrabold text-[#15151B] m-0">
                Browse By Category
              </h2>
              <p className="text-xs md:text-sm text-black/55 leading-relaxed max-w-xs ">
                Choose between traditional A2 cow dairy or creamy rich buffalo
                fats prepared using ancient wooden Bilona churning.
              </p>
              {/* Manual toggle buttons */}
              <div className="flex gap-2 pt-2">
                {categoriesList.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCatIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      activeCatIndex === idx
                        ? "bg-secondary w-6"
                        : "bg-white/30 w-2.5"
                    }`}
                    aria-label={`Show ${cat.name}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right stacked swippable cards */}
          <div
            className="lg:col-span-7 p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden select-none active:cursor-grabbing cursor-grab"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <div className="relative w-full max-w-[280px] h-[130px] flex items-center justify-center">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() =>
                  setActiveCatIndex((prev) => (prev === 0 ? 1 : 0))
                }
                className="absolute -left-6 z-30 bg-white hover:bg-stone-50 border border-stone-250/60 text-primary p-2.5 rounded-full shadow-md transition-all active:scale-90 pointer-events-auto cursor-pointer focus:outline-hidden"
                aria-label="Previous Category"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative w-[240px] h-[250px] pointer-events-none">
                {categoriesList.map((cat, idx) => {
                  const isActive = idx === activeCatIndex;
                  return (
                    <div
                      key={cat.id}
                      onClick={
                        isActive ? undefined : () => setActiveCatIndex(idx)
                      }
                      className={`absolute inset-0 transition-all py-7 duration-555 ease-out pointer-events-auto cursor-pointer ${
                        isActive
                          ? "transform translate-x-0 scale-100 z-20 opacity-100"
                          : "transform translate-x-12 scale-90 z-10 opacity-40 hover:opacity-75 hover:translate-x-14"
                      }`}
                    >
                      <CategoryCard category={cat} />
                    </div>
                  );
                })}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() =>
                  setActiveCatIndex((prev) => (prev === 0 ? 1 : 0))
                }
                className="absolute -right-6 z-30 bg-white hover:bg-stone-50 border border-stone-250/60 text-primary p-2.5 rounded-full shadow-md transition-all active:scale-90 pointer-events-auto cursor-pointer focus:outline-hidden"
                aria-label="Next Category"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Visual swipe hint label */}
            {/* <span className="text-[11px] font-bold text-stone-400 mt-4 tracking-wider flex items-center gap-1.5 animate-pulse select-none">
              👈 Swipe, drag, or click cards/arrows to toggle 👉
            </span> */}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-5 space-y-8 max-md:space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-left space-y-1">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-stone-850">
              {t("featuredProducts")}
            </h2>
            <p className="text-xs md:text-sm text-stone-500 font-medium">
              Handcrafted in small batches, our best-selling organic ghee jars.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs md:text-sm font-bold max-md:self-end text-primary hover:text-primary-light flex items-center gap-1.5 transition-all"
          >
            <span>View All Products</span>
            <span className="text-lg">→</span>
          </Link>
        </div>

        {loading ? (
          <Loader type="skeleton-card" count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us Section (Vibrant colorful cards) */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-stone-850">
            {t("whyChooseUs")}
          </h2>
          <p className="text-xs md:text-sm text-stone-500 max-w-sm mx-auto font-medium">
            Our commitment to purity, ancient techniques, and small farming
            communities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-md:gap-0 bg-[#984447] rounded-3xl">
          {wcuList.map((wcu, index) => (
            <WhyChooseCard
              key={wcu.id}
              icon={wcu.icon}
              title={wcu.title}
              description={wcu.description}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* How It Works (Bilona Churning Video) */}
      <section
        id="how-it-works"
        className="bg-stone-50 py-16 border-y border-stone-200/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-5 grid grid-cols-1 lg:grid-cols-12 gap-10 items-baseline-last">
          {hiwList.length > 0 ? (
            <>
              <div className="lg:col-span-5 space-y-5 text-left">
                <span className="text-xs font-bold text-primary bg-primary/5 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  Our Process
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-stone-850 pt-4">
                  {hiwList[0].title || "Traditional Wooden Bilona Method"}
                </h2>
                <p className="text-xs md:text-sm text-stone-500 leading-relaxed">
                  {hiwList[0].description ||
                    "We do not believe in industrial processing. We boil raw milk, set curd overnight, hand-churn the curd using bidirectional wooden rotators to separate butter (makkhan), and slowly cook the butter over clay stoves to produce granular, highly aromatic, nutritious Ghee."}
                </p>
                <div className="space-y-3">
                  <div className="flex gap-3 text-xs md:text-sm font-medium text-stone-700">
                    <span className="text-emerald-600">✔</span>
                    <span>Bidirectional slow wood churning</span>
                  </div>
                  <div className="flex gap-3 text-xs md:text-sm font-medium text-stone-700">
                    <span className="text-emerald-600">✔</span>
                    <span>No high-heat industrial separators</span>
                  </div>
                  <div className="flex gap-3 text-xs md:text-sm font-medium text-stone-700">
                    <span className="text-emerald-600">✔</span>
                    <span>Retains natural proteins and vitamins</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <VideoPlayer
                  url={
                    hiwList[0].videoUrl ||
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  }
                  poster="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=800"
                />
              </div>
            </>
          ) : (
            <div className="col-span-12">
              <Loader />
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-stone-850">
            {t("reviewsTitle")}
          </h2>
          <p className="text-xs md:text-sm text-stone-500 max-w-sm mx-auto font-medium">
            Read pure testimonies from verified buyers.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="relative cursor-pointer">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              loop={customerReviews.length > 2 ? true : false}
              navigation={{
                prevEl: ".reviews-prev-btn",
                nextEl: ".reviews-next-btn",
              }}
              pagination={{ el: ".reviews-pagination", clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-2"
            >
              {customerReviews.map((rev, index) => (
                <SwiperSlide key={rev.id}>
                  <ReviewCard review={rev} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Down Center Swipe Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              {/* <button
                type="button"
                className="reviews-prev-btn w-9 h-9 rounded-full bg-[#1f9d55] hover:bg-[#157f43] text-white flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-xs border-0 focus:outline-hidden"
                aria-label="Previous review"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button> */}

              <div className="reviews-pagination custom-pagination flex items-center gap-1"></div>

              {/* <button
                type="button"
                className="reviews-next-btn w-9 h-9 rounded-full bg-[#1f9d55] hover:bg-[#157f43] text-white flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-xs border-0 focus:outline-hidden"
                aria-label="Next review"
              >
                <FiChevronRight className="w-5 h-5" />
              </button> */}
            </div>
          </div>
        )}
      </section>

      {/* FAQs Section (Left Side Support Helpline Card + Right Side Accordion FAQ) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-6">
        <div className="text-center space-y-2 pb-2">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-stone-850">
            {t("faqTitle")}
          </h2>
          <p className="text-xs md:text-sm text-stone-500 max-w-sm mx-auto font-medium">
            Got questions? We have compiled standard queries regarding Bilona
            Ghee.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="flex gap-8 lg:gap-8 items-end max-md:flex-col">
            {/* Left Side: Accordion FAQs */}
            <div className="lg:col-span-7 space-y-4 w-fit">
              {faqList.map((faq) => (
                <FAQAccordion
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>

            {/* Right Side: Support Call Card */}
            <div className="lg:col-span-5 bg-[#5C7457] w-xl max-md:w-fit text-white rounded-xl p-3 shadow-lg text-left space-y-6 relative overflow-hidden border-0">
              <div className="absolute top-[-10%] right-[-10%] w-48 h-48 rounded-full bg-white/5 blur-2xl"></div>

              <div className="space-y-3 relative z-10">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-secondary py-1 rounded-full">
                  Customer Care Support
                </span>
                <h3 className="font-display font-extrabold text-sm sm:text-xl text-white m-0 pt-2">
                  Still have questions?
                </h3>
                <p className="text-xs sm:text-xs text-stone-200 leading-relaxed">
                  Can't find the answer you're looking for? Speak with our
                  support team for personalized assistance.
                </p>
              </div>

              {/* Phone call div details */}
              <div className="backdrop-blur-md w-fit bg-[#414288] rounded p-1 space-y-3 relative z-10 shadow-inner">
                <a
                  href="tel:+919535339311"
                  className="text-lg sm:text-xl font-extrabold text-secondary hover:text-white transition-colors flex items-center gap-2.5"
                >
                  <span>95353 39311</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
