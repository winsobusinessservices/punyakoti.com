import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary-dark text-stone-300 border-t border-primary/20">
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ">
              <img
                src="/punyakoti-logo.jpeg"
                alt={t("brandName")}
                className="w-full h-full rounded-md object-contain"
              />
            </div>
            <span className="text-xl font-display font-bold text-white tracking-wide">
              {t("brandName")}
            </span>
          </div>
          <p className="text-xs md:text-sm text-stone-400 leading-relaxed max-w-sm">
            Nourishing families with pure, unadulterated, A2 dairy products
            sourced responsibly from native breeds using wooden Bilona churning.
          </p>
          {/* Social Icons */}
          <div className="flex gap-3 pt-2">
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-primary-light/10 hover:bg-secondary hover:text-primary-dark flex items-center justify-center transition-all focus:outline-hidden"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-primary-light/10 hover:bg-secondary hover:text-primary-dark flex items-center justify-center transition-all focus:outline-hidden"
              aria-label="Twitter"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-primary-light/10 hover:bg-secondary hover:text-primary-dark flex items-center justify-center transition-all focus:outline-hidden"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-primary-light/10 hover:bg-secondary hover:text-primary-dark flex items-center justify-center transition-all focus:outline-hidden"
              aria-label="YouTube"
            >
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-white font-display font-semibold mb-5 text-sm md:text-base uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-3 text-xs md:text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-secondary transition-colors font-medium"
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-secondary transition-colors font-medium"
              >
                {t("products")}
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-secondary transition-colors font-medium"
              >
                {t("cart")}
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:text-secondary transition-colors font-medium"
              >
                {t("profile")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 className="text-white font-display font-semibold mb-5 text-sm md:text-base uppercase tracking-wider">
            Contact Us
          </h4>
          <ul className="space-y-4 text-xs md:text-sm text-stone-400">
            <li className="flex items-start gap-3">
              <FiMapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span>
                Punyakoti Farms, Organic Zone, Bengaluru, Karnataka, 560001
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="w-5 h-5 text-secondary shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-secondary shrink-0" />
              <span>support@punyakoti.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-primary-dark/60 border-t border-primary/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <span>
            &copy; {new Date().getFullYear()} Punyakoti. All rights reserved.
          </span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-stone-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
