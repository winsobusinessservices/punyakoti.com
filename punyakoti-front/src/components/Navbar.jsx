import React, { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
} from "react-icons/fi";
import { FaPhone, FaSearch, FaUser } from "react-icons/fa";
import { GiCaptainHatProfile, GiRamProfile } from "react-icons/gi";

const Navbar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const { cartTotalCount } = useCart();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Update search query state if URL changes
  React.useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setMobileOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { label: t("home"), path: "/" },
    { label: t("products"), path: "/products" },
    // { label: t("cart"), path: "/cart", isCart: true },
    { label: t("About Us"), path: "/about" },
    // { label: t("profile"), path: "/profile" },
    { label: t("Blogs"), path: "/blogs" },
    { label: t("contact"), path: "/contact" },
  ];

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30 shadow-xs rounded-xl mx-2 sm:mx-5 mt-2 sm:mt-3">
        <div className="px-4 sm:px-6 lg:px-16">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="rounded-full flex items-center justify-center font-bold">
                <img
                  src="/icon.png"
                  alt={t("brandName")}
                  className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
                />
                <div className="flex flex-col items-center hidden sm:flex">
                  <span className="text-xl sm:text-2xl font-display font-bold tracking-wide text-primary-dark">
                    {t("brandName")}
                  </span>
                  <p className="text-[10px] sm:text-xs font-display font-light tracking-wider text-primary-dark">
                    Pure By Nature
                  </p>
                </div>
              </div>
            </Link>

            {/* Desktop Nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-semibold transition-all relative py-1 hover:text-primary ${
                      isActive ? "text-primary" : "text-stone-600"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                    )}
                  </Link>
                );
              })}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-10 pr-4 py-1 w-52 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Desktop Right actions */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSelector />

              {role === "Admin" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-all"
                  title="Admin Panel"
                >
                  <FiShield className="w-3.5 h-3.5" />
                  <span>{t("admin")}</span>
                </Link>
              )}

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-stone-500 hover:text-rose-600 bg-stone-100 hover:bg-rose-50 p-2 rounded-xl transition-all"
                  title={t("logout")}
                  aria-label="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-stone-600 hover:text-primary font-semibold text-sm"
                >
                  Sign In
                </Link>
              )}

              {isAuthenticated && (
                <span className="flex gap-3 items-center">
                  <Link
                    to="/cart"
                    className="flex relative items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-white border border-stone-200 hover:bg-emerald-200 p-2 rounded-full transition-all"
                    title="Cart"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    {/* <span className="text-sm">{t("cart")}</span> */}
                    {cartTotalCount > 0 && (
                      <span className="absolute -top-2.5 -right-3.5 bg-secondary text-primary-dark text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                        {cartTotalCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className="text-stone-600 hover:text-primary font-semibold text-sm bg-white border border-stone-200 hover:bg-emerald-200 p-2 rounded-full transition-all"
                  >
                    <FaUser className="w-4 h-4" />
                  </Link>
                </span>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center gap-1.5 sm:gap-2">
              {isAuthenticated && (
                <Link
                  to="/cart"
                  className="relative p-2 text-stone-600 hover:text-primary transition-colors"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {cartTotalCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartTotalCount}
                    </span>
                  )}
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="relative p-2 text-stone-600 hover:text-primary transition-colors"
                >
                  <FaUser className="w-5 h-5" />
                </Link>
              )}
              <LanguageSelector />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-stone-600 p-2 hover:bg-stone-100 rounded-xl transition-all"
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay & Menu (Outside of nav to avoid containing block issues from backdrop-blur) */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        {/* Sliding Drawer */}
        <div
          className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-stone-200">
                <img
                  src="/punyakoti-logo.jpeg"
                  alt={t("brandName")}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <span className="font-display font-bold text-xl text-primary-dark tracking-wide">
                {t("brandName")}
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2.5 bg-white hover:bg-stone-200 rounded-full transition-colors text-stone-600 shadow-sm border border-stone-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4 bg-white">
            {/* Mobile Search Bar */}
            <div className="relative mb-2">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              />
            </div>
            
            <div className="space-y-2.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-bold transition-all border ${
                    isActive
                      ? "bg-primary/10 text-primary-dark border-primary/20 shadow-sm"
                      : "text-stone-600 border-transparent hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isCart && cartTotalCount > 0 && (
                    <span className="bg-secondary text-primary-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {cartTotalCount}
                    </span>
                  )}
                </Link>
              );
            })}
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 border-t border-stone-100 space-y-3 bg-stone-50">
            {role === "Admin" && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors shadow-xs"
              >
                <FiShield className="w-4 h-4" />
                <span>{t("admin")} Dashboard</span>
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl text-sm font-bold text-primary-dark bg-primary/10 hover:bg-primary/20 transition-colors shadow-xs"
              >
                <FaUser className="w-4 h-4" />
                <span>{t("profile")}</span>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl text-sm font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 transition-colors shadow-xs"
              >
                <FiLogOut className="w-4 h-4" />
                <span>{t("logout")}</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-md"
              >
                <FiUser className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
