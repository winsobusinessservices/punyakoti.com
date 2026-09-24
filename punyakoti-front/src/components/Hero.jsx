import { Link } from "react-router-dom";
import Model from "./Model";
import { FcRight } from "react-icons/fc";

const Hero = () => {
  // return (
  //   <section className="relative rounded-2xl mt-5 bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white overflow-hidden py-16 md:py-16 px-4 sm:px-6 lg:px-8">

  //     <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
  //       {/* Left Text details */}
  //       <div className="lg:col-span-1 space-y-6 text-left">
  //         <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none">
  //           {activeBanner.title || t("heroTitle")}
  //         </h1>

  //         <p className="text-stone-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
  //           {/* {activeBanner.subtitle || t("heroSubtitle")} */}
  //         </p>

  //         <div className="pt-4 flex flex-wrap gap-4">
  //           <Link
  //             to={activeBanner.linkUrl || "/products"}
  //             className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-primary-dark font-bold text-sm px-7 py-3.5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 focus:outline-hidden"
  //           >
  //             <span>{t("shopNow")}</span>
  //             <FiArrowRight className="w-4 h-4" />
  //           </Link>

  //           <a
  //             href="#how-it-works"
  //             className="inline-flex items-center justify-center border border-white/30 hover:border-white hover:bg-white/10 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl transition-all"
  //           >
  //             Learn More
  //           </a>
  //         </div>

  //         {/* Simple specs grid */}
  //         <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-md">
  //           <div>
  //             <span className="text-xl sm:text-2xl font-display font-extrabold text-secondary">
  //               100%
  //             </span>
  //             <p className="text-[10px] text-stone-300 uppercase font-semibold tracking-wider">
  //               Natural Pure
  //             </p>
  //           </div>
  //           <div>
  //             <span className="text-xl sm:text-2xl font-display font-extrabold text-secondary">
  //               Bilona
  //             </span>
  //             <p className="text-[10px] text-stone-300 uppercase font-semibold tracking-wider">
  //               Traditional Method
  //             </p>
  //           </div>
  //           <div>
  //             <span className="text-xl sm:text-2xl font-display font-extrabold text-secondary">
  //               A2
  //             </span>
  //             <p className="text-[10px] text-stone-300 uppercase font-semibold tracking-wider">
  //               Beta-Casein Only
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="w-full h-full">
  //         <Model />
  //       </div>

  //       {/* Right Media graphics */}
  //       {/* <div className="lg:col-span-5 relative flex justify-center">
  //         <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-stone-900 group">
  //           <img
  //             src={activeBanner.imageUrl}
  //             alt={activeBanner.title || "Hero Banner"}
  //             className="w-full h-full object-bottom group-hover:scale-103 transition-transform duration-500"
  //           />
  //           <div className="absolute inset-0 bg-primary/10"></div>
  //         </div>

  //         <div className="absolute -top-4 -right-4 bg-white text-primary-dark font-bold text-xs p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-1 border border-stone-200 animate-float">
  //           <span className="text-lg">🐄</span>
  //           <span className="font-display font-bold uppercase tracking-wider text-[10px]">
  //             Pet Spray
  //           </span>
  //         </div>

  //         <div className="absolute -bottom-4 -left-4 bg-secondary text-primary-dark font-extrabold text-xs px-4 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-secondary/50 animate-float [animation-delay:3s]">
  //           <span>📞</span>
  //           <span className="font-display uppercase tracking-wider text-[10px]">
  //             +91 96634 75345
  //           </span>
  //         </div>
  //       </div> */}
  //     </div>
  //   </section>
  // );
  return (
    <div className="relative w-full flex flex-col justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
          backgroundSize: "70px 70px",
        }}
      ></div>
      <div className="relative z-10 flex flex-col justify-center items-center w-full h-full pt-4 sm:pt-10 pb-4 sm:pb-12">
        <div className="relative w-full max-w-[95%] mx-auto">
          <img
            src="/hero4.png"
            alt="Hero Banner"
            className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain"
          />
        </div>
        <div className="flex flex-col items-center justify-end px-4 z-10 mt-1 md:mt-8 text-center">
          <span className="mb-2 md:mb-6">
            <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black drop-shadow-sm leading-tight">
              Leading Cattle Supplements in India
            </h1>
          </span>
          <div className="flex flex-row justify-center gap-4 w-full max-w-xl mx-auto">
            <Link
              to="/products"
              className="w-auto bg-primary hover:bg-primary-dark text-white font-bold py-1 px-3 sm:py-3.5 sm:px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 sm:text-lg"
            >
              Explore Products
              <FcRight className="w-6 h-6 bg-white rounded-full p-0.5" />
            </Link>
            <Link
              to="/products"
              className="w-auto bg-white/95 hover:bg-white text-gray-900 font-bold py-1 px-3 sm:py-3.5 sm:px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 backdrop-blur-md text-center border border-gray-200 sm:text-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
