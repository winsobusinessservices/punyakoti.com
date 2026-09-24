import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiLayout,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiMessageSquare,
  FiHelpCircle,
  FiCheckCircle,
  FiTv,
  FiImage,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMenu,
  FiX,
  FiShoppingCart,
} from "react-icons/fi";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: FiLayout },
    { name: "Products", path: "/admin/products", icon: FiBox },
    { name: "Categories", path: "/admin/categories", icon: FiGrid },
    { name: "Orders", path: "/admin/orders", icon: FiShoppingBag },
    { name: "Carts", path: "/admin/carts", icon: FiShoppingCart },
    { name: "Users", path: "/admin/users", icon: FiUsers },
    { name: "Reviews", path: "/admin/reviews", icon: FiMessageSquare },
    { name: "FAQ", path: "/admin/faq", icon: FiHelpCircle },
    {
      name: "Why Choose Us",
      path: "/admin/why-choose-us",
      icon: FiCheckCircle,
    },
    { name: "How It Works", path: "/admin/how-it-works", icon: FiTv },
    { name: "Contacts", path: "/admin/contacts", icon: FiMessageSquare },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1f2937] text-white shrink-0 shadow-xl sticky top-0 h-screen z-20">
        <div className="p-6 border-b border-primary-light/20 flex items-center gap-3">
          {/* <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-primary-dark text-lg"> */}
          <div className="w-9 h-9 flex items-center justify-center font-bold text-white ">
            <img
              src="/punyakoti-logo.jpeg"
              className="w-full h-full rounded object-contain"
            />
          </div>
          {/* </div> */}
          <span className="text-xl font-display font-semibold tracking-wide text-stone-100">
            Punyakoti Admin
          </span>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-secondary text-primary-dark shadow-md"
                    : "text-stone-300 hover:bg-primary-light/35 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-light/20 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-primary-light/35 hover:text-white transition-all text-sm font-medium"
          >
            <FiHome className="w-5 h-5" />
            <span>Storefront</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all text-sm font-medium text-left"
          >
            <FiLogOut className="w-5 h-5" />
            <span>{user ? "Logout" : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Top Header - Mobile */}
      <header className="md:hidden bg-[#1f2937] text-white p-4 flex items-center justify-between shadow-md z-25">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-primary-dark">
            <img
              src="/punyakoti-logo.jpeg"
              className="w-full h-full rounded object-contain"
            />
          </div>
          <span className="font-display font-semibold">Punyakoti Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white hover:text-secondary focus:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="w-64 max-w-xs bg-[#1f2937] h-full flex flex-col p-4 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-primary-light/20">
              <span className="font-display text-lg font-bold text-white">
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-stone-300 hover:text-white"
                aria-label="Close navigation menu"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-grow space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                      isActive
                        ? "bg-secondary text-primary-dark shadow-md"
                        : "text-stone-300 hover:bg-primary-light/35 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-primary-light/20 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-300 hover:bg-primary-light/35 hover:text-white transition-all text-sm font-medium"
              >
                <FiHome className="w-5 h-5" />
                <span>Storefront</span>
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all text-sm font-medium text-left"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Top Navbar - Desktop */}
        <header className="hidden md:flex bg-white border-b border-stone-200 h-16 shrink-0 items-center justify-between px-8 shadow-xs">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">
              Welcome back,{" "}
              <span className="text-primary">{user?.name || "Admin"}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
              System Online
            </span>
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user?.name ? user.name[0] : "A"}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-3 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
