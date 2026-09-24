import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-stone-300 relative overflow-hidden pt-10 sm:pt-16 lg:pt-24 pb-6 sm:pb-8 border-t border-gray-800 mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-between">
        {/* Top Section - Links and Info */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-8 mb-12 sm:mb-20 lg:mb-32">
          {/* Brand/About */}
          <div className="space-y-4 sm:space-y-6 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl shadow-sm">
                <img
                  src="/punyakoti-logo.jpeg"
                  alt={t("brandName") || "Punyakoti"}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain"
                />
              </div>
              <span className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide">
                {t("brandName") || "Punyakoti"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              Nourishing families with pure, unadulterated, cattle products
              sourced responsibly using traditional methods.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-display font-semibold mb-6 text-sm uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium flex flex-col">
              <Link
                to="/"
                className="hover:text-primary transition-colors w-fit"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="hover:text-primary transition-colors w-fit"
              >
                Products
              </Link>
              <Link
                to="/about"
                className="hover:text-primary transition-colors w-fit"
              >
                About Us
              </Link>
              <Link
                to="/blogs"
                className="hover:text-primary transition-colors w-fit"
              >
                Blogs
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary transition-colors w-fit"
              >
                Contact Us
              </Link>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-display font-semibold mb-6 text-sm uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3 hover:text-white transition-colors cursor-default">
                <FiMapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                <span>
                  Punyakoti Farms, Organic Zone, Bengaluru, Karnataka, 560001
                </span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <FiPhone className="w-5 h-5 text-gray-500 shrink-0" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <FiMail className="w-5 h-5 text-gray-500 shrink-0" />
                <a href="mailto:support@punyakoti.com">support@punyakoti.com</a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-display font-semibold mb-6 text-sm uppercase tracking-widest">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary hover:-translate-y-1 text-gray-400 hover:text-white flex items-center justify-center transition-all shadow-lg"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary hover:-translate-y-1 text-gray-400 hover:text-white flex items-center justify-center transition-all shadow-lg"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary hover:-translate-y-1 text-gray-400 hover:text-white flex items-center justify-center transition-all shadow-lg"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary hover:-translate-y-1 text-gray-400 hover:text-white flex items-center justify-center transition-all shadow-lg"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Large Text */}
        <div className="flex flex-col items-center justify-center border-t border-gray-800 pt-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between w-full text-xs text-gray-500 mb-4 md:mb-0 px-2 relative z-20">
            <span>
              &copy; {new Date().getFullYear()} Punyakoti. All rights reserved.
            </span>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Giant Background Text */}
          <div className="w-full text-center flex justify-center items-center pointer-events-none select-none relative mt-4 sm:mt-8 md:-mt-12 lg:-mt-24 z-0 overflow-hidden">
            <span
              className="font-display font-black uppercase leading-none tracking-tighter bg-gradient-to-b from-gray-800 to-gray-900 text-transparent bg-clip-text block w-full"
              style={{
                fontSize: "clamp(2.5rem, 15vw, 18rem)",
              }}
            >
              Punyakoti
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
