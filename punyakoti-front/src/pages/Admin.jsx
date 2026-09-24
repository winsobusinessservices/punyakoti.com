import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";
import {
  FiUsers,
  FiShoppingBag,
  FiBox,
  FiDollarSign,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";

const Admin = () => {
  const {
    data: dashboardStats = {
      totalUsers: 0,
      totalOrders: 0,
      totalProducts: 0,
      pendingReviews: 0,
      dailySales: 0,
      weeklySales: 0,
      monthlySales: 0,
      totalSales: 0,
      recentLogins: [],
    },
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: adminApi.getDashboardStats,
  });

  const stats = [
    {
      name: "Total Users",
      value: dashboardStats.totalUsers,
      icon: FiUsers,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      name: "Total Orders",
      value: dashboardStats.totalOrders,
      icon: FiShoppingBag,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      name: "Total Products",
      value: dashboardStats.totalProducts,
      icon: FiBox,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      name: "Pending Reviews",
      value: dashboardStats.pendingReviews,
      icon: FiMessageSquare,
      color: "bg-rose-500/10 text-rose-600",
    },
    {
      name: "Daily Sales",
      value: `₹${dashboardStats.dailySales || 0}`,
      icon: FiDollarSign,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      name: "Weekly Sales",
      value: `₹${dashboardStats.weeklySales || 0}`,
      icon: FiDollarSign,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      name: "Monthly Sales",
      value: `₹${dashboardStats.monthlySales || 0}`,
      icon: FiDollarSign,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      name: "Total Sales",
      value: `₹${dashboardStats.totalSales || 0}`,
      icon: FiDollarSign,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  const salesTrend = dashboardStats.salesTrend && dashboardStats.salesTrend.length === 7 
    ? dashboardStats.salesTrend 
    : Array(7).fill({ month: "-", revenue: 0 });
  
  const maxRevenue = Math.max(...salesTrend.map((s) => s.revenue), 100);

  const getCoordinates = (index, revenue) => {
    const x = 70 + index * 100;
    const y = 170 - (revenue / maxRevenue) * 150;
    return { x, y };
  };

  const pathD =
    "M " +
    salesTrend
      .map((s, index) => {
        const { x, y } = getCoordinates(index, s.revenue);
        return `${x} ${y}`;
      })
      .join(" L ");

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-stone-850 m-0">
          Dashboard Overview
        </h1>
        <p className="text-xs md:text-sm text-stone-500">
          Real-time metrics, order volumes, and customer logins.
        </p>
      </div>

      {/* Grid of stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  {stat.name}
                </span>
                <p className="text-2xl font-extrabold text-stone-800">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Chart using customized responsive SVG */}
        <div className="lg:col-span-8 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-stone-800 text-lg">
            Sales Trend (Monthly)
          </h3>

          <div className="relative h-64 w-full pt-4">
            {/* SVG line chart illustration */}
            <svg
              viewBox="0 0 700 200"
              className="w-full h-full text-primary"
              aria-label="Monthly Sales Chart"
            >
              {/* Grid lines */}
              <line
                x1="50"
                y1="20"
                x2="680"
                y2="20"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="70"
                x2="680"
                y2="70"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="120"
                x2="680"
                y2="120"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <line
                x1="50"
                y1="170"
                x2="680"
                y2="170"
                stroke="#e5e7eb"
                strokeWidth="1.5"
              />

              {/* Line path mapping to real sales data points */}
              <path
                d={pathD}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points dots */}
              {salesTrend.map((s, i) => {
                const { x, y } = getCoordinates(i, s.revenue);
                return (
                  <circle
                    key={`circle-${i}`}
                    cx={x}
                    cy={y}
                    r="5"
                    className="fill-secondary stroke-primary stroke-2 hover:r-7 transition-all cursor-pointer"
                  >
                    <title>{`${s.month}: ₹${s.revenue}`}</title>
                  </circle>
                );
              })}

              {/* Month Labels */}
              {salesTrend.map((s, i) => {
                const x = 70 + i * 100;
                return (
                  <text
                    key={`text-${i}`}
                    x={x}
                    y="192"
                    textAnchor="middle"
                    className="text-[10px] fill-stone-400 font-bold"
                  >
                    {s.month}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Recent logins column */}
        <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-stone-800 text-lg">
            Recent Logins
          </h3>

          <div className="flow-root">
            <ul className="-my-5 divide-y divide-stone-100">
              {dashboardStats?.recentLogins?.map((login, idx) => (
                <li
                  key={idx}
                  className="py-4 flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-600">
                      {login.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 leading-tight">
                        {login.name}
                      </p>
                      <span className="text-[10px] text-stone-400">
                        {login.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-stone-400 font-medium">
                    <FiClock className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{login.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
