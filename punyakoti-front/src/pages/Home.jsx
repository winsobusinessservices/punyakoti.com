import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FiChevronLeft, FiChevronRight, FiMessageCircle, FiPhone } from "react-icons/fi";
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

import COW_ICON from "../assets/cow.svg";
import BUFFALO_ICON from "../assets/buffalo.svg";

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

  // Stacked Category slider index removed as it is replaced by Swiper

  return (
    <div className="space-y-10 md:space-y-16 pb-20 overflow-x-hidden">
      {/* Hero Banner */}
      <div className="w-full">
        <Hero />
      </div>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-3xl p-6 sm:py-6 sm:px-8 border border-stone-200/60 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-1">
              <span className="text-[11px] md:text-xs font-extrabold tracking-widest text-gray-500 uppercase">
                Shop By Category
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 m-0">
                Explore Our Product Range
              </h2>
              <p className="text-sm md:text-[15px] text-stone-500 max-w-md pt-1">
                Everything you need for healthier and more productive cattle.
              </p>
            </div>

            {/* Custom Navigation Arrows for Swiper */}
            <div className="flex gap-2">
              <button
                className="cat-prev-btn w-9 h-9 flex items-center justify-center rounded-full bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50 hover:text-primary transition-all shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] active:scale-95 z-10"
                aria-label="Previous category"
              >
                <FiChevronLeft className="w-5 h-5 -ml-0.5" />
              </button>
              <button
                className="cat-next-btn w-9 h-9 flex items-center justify-center rounded-full bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50 hover:text-primary transition-all shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] active:scale-95 z-10"
                aria-label="Next category"
              >
                <FiChevronRight className="w-5 h-5 -mr-0.5" />
              </button>
            </div>
          </div>

          {/* Categories Slider */}
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".cat-prev-btn",
              nextEl: ".cat-next-btn",
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              500: { slidesPerView: 3, spaceBetween: 16 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 24 },
              1280: { slidesPerView: 7, spaceBetween: 20 },
            }}
            className="w-full pb-2"
          >
            {categoriesList.map((cat, idx) => {
              // Creating a soft background color sequence based on index (Grays and Blues)
              const bgColors = [
                "bg-gray-100",
                "bg-gray-200",
                "bg-amber-50",
                "bg-stone-100",
                "bg-gray-50",
                "bg-slate-100",
                "bg-zinc-100",
              ];
              const circleBg = bgColors[idx % bgColors.length];

              return (
                <SwiperSlide key={cat.id || idx}>
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="flex flex-col items-center justify-center bg-white rounded-[20px] p-6 py-3 border border-stone-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 ${circleBg} transition-transform duration-500 ease-out group-hover:scale-110`}
                    >
                      {/* {cat.imageUrl ? (
                        <img
                          src={
                            cat.imageUrl.startsWith("http")
                              ? cat.imageUrl
                              : `http://localhost:3002${cat.imageUrl}`
                          }
                          alt={cat.name}
                          className="w-10 h-10 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-3xl font-extrabold text-stone-300/80 uppercase">
                          {cat.name?.charAt(0)}
                        </span>
                      )} */}
                      <span className="w-full h-full">
                        {cat.name.toLowerCase().includes("cow") ? (
                          <img
                            src={COW_ICON}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={BUFFALO_ICON}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </span>
                    </div>
                    <h3 className="text-[13px] md:text-sm font-extrabold text-stone-800 text-center leading-tight">
                      {cat.name}
                    </h3>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
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
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 lg:gap-8 hide-scrollbar snap-x snap-mandatory pb-4">
            <Loader type="skeleton-card" count={3} />
          </div>
        ) : (
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 lg:gap-8 hide-scrollbar snap-x snap-mandatory pb-4">
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="min-w-[75vw] sm:min-w-[45vw] lg:min-w-0 snap-start shrink-0">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us Section (Vibrant colorful cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16 px-6 sm:px-8 md:px-12 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-12 lg:gap-16 items-center lg:items-start">
        {/* Left Side: Title */}
        <div className="lg:w-1/4 shrink-0 space-y-5 text-center lg:text-left">
          <div className="space-y-3 flex flex-col items-center lg:items-start">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Minimal
            </span>
            <div className="w-8 h-0.5 bg-gray-300"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 leading-[1.1]">
            Why<br className="hidden lg:block" /> choose us
          </h2>
        </div>

        {/* Right Side: Grid of items */}
        <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-12">
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
        </div>
      </section>

      {/* How It Works (Bilona Churning Video) */}
      <section id="how-it-works" className="bg-white py-12 lg:py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hiwList.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
              {/* Left Side: Title & Steps */}
              <div className="lg:w-1/2 w-full space-y-12">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                      How it Works
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-gray-900 leading-tight">
                    Traditional processes <br className="hidden md:block" />
                    <span className="text-gray-400">for pure natural quality.</span>
                  </h2>
                </div>

                {/* Vertical Stepper */}
                <div className="relative border-l border-gray-200 ml-4 space-y-10">
                  {/* Using hiwList data or fallback to 3 steps */}
                  {[
                    {
                      title: "Ask or describe your task",
                      desc: "Type what you need in simple language. Our team understands your request, context, and goal for your cattle needs.",
                    },
                    {
                      title: "Let us prepare your products",
                      desc: "We analyze your input, apply traditional methods like bidirectional churning, and prepare the purest natural products.",
                    },
                    {
                      title: "Review and deliver",
                      desc: "Check the prepared natural produce, adjust anything you need, and receive the best quality right at your doorstep.",
                    },
                  ].map((step, index) => (
                    <div key={index} className="relative pl-10 group">
                      <div className="absolute -left-4 top-0 bg-amber-50 border border-amber-100 shadow-sm rounded-lg flex items-center justify-center w-8 h-8 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {/* Step number icon */}
                        <span className="text-xs font-bold font-display">{index + 1}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        Step {index + 1}
                      </span>
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1.5">
                        {index === 0 && hiwList[0] ? hiwList[0].title || step.title : step.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-sm">
                        {index === 0 && hiwList[0] ? hiwList[0].description || step.desc : step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Description & Video */}
              <div className="lg:w-1/2 w-full lg:mt-6 flex flex-col gap-10">
                <p className="text-sm md:text-base text-gray-500 leading-relaxed lg:pl-12 border-l-0 lg:border-l border-gray-100">
                  Describe exactly what you need, let our traditional processes intelligently create the best cattle products, then review and experience them in just a few clicks.
                </p>

                <div className="bg-white p-2.5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white -z-10"></div>
                   <div className="rounded-2xl overflow-hidden relative shadow-inner bg-stone-100 aspect-video">
                      <VideoPlayer
                        url={
                          hiwList[0]?.videoUrl ||
                          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                        }
                        poster="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80&w=800"
                      />
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center py-20">
              <Loader />
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
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
                className="reviews-prev-btn w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-xs border-0 focus:outline-hidden"
                aria-label="Previous review"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button> */}

              <div className="reviews-pagination custom-pagination flex items-center gap-1"></div>

              {/* <button
                type="button"
                className="reviews-next-btn w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-xs border-0 focus:outline-hidden"
                aria-label="Next review"
              >
                <FiChevronRight className="w-5 h-5" />
              </button> */}
            </div>
          </div>
        )}
      </section>

      {/* FAQs Section (Left Side Support Helpline Card + Right Side Accordion FAQ) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            {/* Left Side: Title & Support Card */}
            <div className="lg:w-1/3 w-full shrink-0 flex flex-col gap-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-[40px] font-display font-medium text-gray-900 leading-tight">
                  {t("faqTitle") || "Frequently Asked Question"}
                </h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Trusted in more than 100 countries and 5 million customers.
                </p>
              </div>

              {/* Support Call Card */}
              <div className="bg-stone-50 rounded-2xl p-6 md:p-8 text-left space-y-4 border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="bg-transparent p-0 rounded-lg">
                    <FiMessageCircle className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="font-display font-bold text-base md:text-lg text-gray-900 m-0">
                    You have different questions?
                  </h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Our team will answer all your questions. we ensure a quick response.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-full transition-colors text-sm shadow-md mt-2"
                >
                  <FiPhone className="w-4 h-4" />
                  Contact Our Team
                </Link>
              </div>
            </div>

            {/* Right Side: Accordion FAQs */}
            <div className="lg:w-2/3 w-full flex flex-col pt-2">
              {faqList.map((faq, index) => (
                <div key={faq.id} className={index === 0 ? "border-t border-gray-200" : ""}>
                  <FAQAccordion
                    question={faq.question}
                    answer={faq.answer}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
