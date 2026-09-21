import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";
import {
  FiUsers,
  FiShoppingBag,
  FiBox,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";

const Admin = () => {
  const {
    data: dashboardStats = {
      totalUsers: 0,
      totalOrders: 0,
      totalProducts: 0,
      monthlySales: "₹0",
      recentLogins: [],
    },
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: adminApi.getDashboardStats,
  });
  // console.log(dashboardStats);

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
      name: "Monthly Sales",
      value: dashboardStats.monthlySales,
      icon: FiDollarSign,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

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

              {/* Line path mapping to sales data points: Jan: 120k, Feb: 145k, Mar: 190k, Apr: 170k, May: 220k, Jun: 280k, Jul: 310k */}
              {/* Coordinates computed relative to grid */}
              <path
                d="M 70 140 L 170 120 L 270 90 L 370 100 L 470 70 L 570 40 L 670 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points dots */}
              <circle
                cx="70"
                cy="140"
                r="5"
                className="fill-secondary stroke-primary stroke-2"
              />
              <circle
                cx="170"
                cy="120"
                r="5"
                className="fill-secondary stroke-primary stroke-2"
              />
              <circle
                cx="270"
                cy="90"
                r="5"
                className="fill-secondary stroke-primary stroke-2"
              />
              <circle
                cx="370"
                cy="100"
                r="5"
                className="fill-secondary stroke-primary stroke-2"
              />
              <circle
                cx="470"
                cy="70"
                r="5"
                className="fill-secondary stroke-primary stroke-2"
              />
              <circle
                cx="570"
                cy="40"
                r="5"
                className="fill-secondary stroke-primary stroke-2"
              />
              <circle
                cx="670"
                cy="20"
                r="5"
                className="fill-secondary stroke-primary stroke-2"
              />

              {/* Month Labels */}
              <text
                x="70"
                y="192"
                textAnchor="middle"
                className="text-[10px] fill-stone-400 font-bold"
              >
                Jan
              </text>
              <text
                x="170"
                y="192"
                textAnchor="middle"
                className="text-[10px] fill-stone-400 font-bold"
              >
                Feb
              </text>
              <text
                x="270"
                y="192"
                textAnchor="middle"
                className="text-[10px] fill-stone-400 font-bold"
              >
                Mar
              </text>
              <text
                x="370"
                y="192"
                textAnchor="middle"
                className="text-[10px] fill-stone-400 font-bold"
              >
                Apr
              </text>
              <text
                x="470"
                y="192"
                textAnchor="middle"
                className="text-[10px] fill-stone-400 font-bold"
              >
                May
              </text>
              <text
                x="570"
                y="192"
                textAnchor="middle"
                className="text-[10px] fill-stone-400 font-bold"
              >
                Jun
              </text>
              <text
                x="670"
                y="192"
                textAnchor="middle"
                className="text-[10px] fill-stone-400 font-bold"
              >
                Jul
              </text>
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
