import React, { useRef, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Home, Users, DollarSign, Clock ,ChevronLeft, ChevronRight} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GuestInsights from "../../../shared/components/GuestInsights";

// Define types
interface GuestDataType {
  type: string;
  Capacity: number;
  Active: number;
}

interface RevenueDataType {
  name: string;
  value: number;
}

interface OverdueDataType {
  name: string;
  value: number;
}

export default function Dashboard(): JSX.Element {
  const navigate = useNavigate();

  // Sample data
  const guestData: GuestDataType[] = [
    { type: "Single", Capacity: 25, Active: 20 },
    { type: "Double", Capacity: 50, Active: 35 },
    { type: "Total", Capacity: 75, Active: 55 },
  ];

  const revenueData: RevenueDataType[] = [
    { name: "Profit", value: 200 },
    { name: "Expense", value: 300 },
    { name: "Revenue", value: 500 },
  ];

  const overdueData: OverdueDataType[] = [
    { name: "< 15 Days", value: 55 },
    { name: "15-30 Days", value: 25 },
    { name: "> 30 Days", value: 20 },
  ];

  const COLORS: string[] = ["#0068DD", "#FFA726", "#EF5350"];

  return (
    <div className="w-full   p-4">
      <header className="mb-6">
        <h1
          className="font-extrabold text-black"
          style={{
            fontSize: "clamp(1rem, 2.6vw, 1.6rem)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Abhishek&apos;s Dashboard
        </h1>
        <div
          className="mt-2 text-[#615F5F] font-extrabold truncate max-w-full,"
          style={{
            fontSize: "clamp(0.78rem, 1.6vw, 1rem)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Hamsa PG, TNGO Colony, Gachibowli, Hyderabad, 25 rooms with 50 beds,
          Owner: Mohan-923456781
        </div>
      </header>

      {/* Cards Grid */}
      <section className="flex justify-center">
        <div className="w-full max-w-[1260px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 justify-items-center
                gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-6 md:gap-x-6 md:gap-y-8 px-4">


          {/* Occupancy */}
          <article
            className="rounded-[30px] flex-shrink-0"
            style={{
              width: "261px",
              height: "487px",
              border: "1px solid rgba(79, 107, 227, 0.00)",
              background: "#FFF",
              boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.10)",
            }}
          >
            <div
              className="h-full rounded-[20px] p-6 flex flex-col transition-transform duration-200"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "#001433",
                fontFamily:
                  "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
                fontFeatureSettings: "'liga' off, 'clig' off",
                background: "transparent",
              }}
            >
              {/* Header */}
              <header className="flex flex-col items-center gap-3">
                <div
                  className="flex-shrink-0"
                  style={{ width: "48px", height: "48px", aspectRatio: "1/1" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    className="w-full h-full"
                  >
                    <path
                      d="M38 14H22V28H6V10H2V40H6V34H42V40H46V22C46 19.8783 45.1571 17.8434 43.6569 16.3431C42.1566 14.8429 40.1217 14 38 14ZM14 26C15.5913 26 17.1174 25.3679 18.2426 24.2426C19.3679 23.1174 20 21.5913 20 20C20 18.4087 19.3679 16.8826 18.2426 15.7574C17.1174 14.6321 15.5913 14 14 14C12.4087 14 10.8826 14.6321 9.75736 15.7574C8.63214 16.8826 8 18.4087 8 20C8 21.5913 8.63214 23.1174 9.75736 24.2426C10.8826 25.3679 12.4087 26 14 26Z"
                      fill="#0B2595"
                    />
                  </svg>
                </div>

                <h3
                  className="font-semibold text-center"
                  style={{
                    color: "#001433",
                    fontSize: "23px",
                    fontWeight: 600,
                    letterSpacing: "-0.154px",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Occupancy Rate
                </h3>
              </header>

              {/* Donut + stats */}
              <div className="flex-1 flex flex-col items-center justify-center mt-3">
                <div
                  className="relative transition-transform duration-300"
                  style={{ width: "164px", height: "159px", flexShrink: 0 }}
                >
                  {/* SVG remains unchanged */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="164"
                    height="159"
                    viewBox="0 0 164 159"
                    fill="none"
                    className="w-full h-full donut"
                  >
                    <path
                      d="M164 79.5C164 123.407 127.287 159 82 159C36.7127 159 0 123.407 0 79.5C0 35.5934 36.7127 0 82 0C127.287 0 164 35.5934 164 79.5ZM22.2219 79.5C22.2219 111.508 48.9855 137.456 82 137.456C115.015 137.456 141.778 111.508 141.778 79.5C141.778 47.492 115.015 21.5444 82 21.5444C48.9855 21.5444 22.2219 47.492 22.2219 79.5Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M82 10.742C82 4.80935 86.8287 -0.0705119 92.7135 0.681347C106.909 2.49503 120.435 7.89141 131.896 16.4119C146.213 27.0553 156.51 41.9793 161.191 58.8716C165.873 75.7639 164.677 93.6815 157.79 109.848C150.903 126.015 138.709 139.528 123.097 148.295C107.485 157.061 89.3264 160.591 71.4353 158.337C53.5442 156.084 36.9191 148.173 24.1358 135.83C11.3526 123.487 3.12477 107.401 0.727264 90.0647C-1.18184 76.26 0.69075 62.2761 6.06602 49.4913C8.37482 44 15.0223 42.2449 20.2281 45.1405C25.6345 48.1477 27.381 55.0094 25.3363 60.8482C22.3862 69.2728 21.4571 78.2925 22.6903 87.2097C24.4399 99.861 30.4443 111.6 39.773 120.607C49.1017 129.615 61.2341 135.388 74.2903 137.032C87.3465 138.677 100.598 136.101 111.991 129.704C123.384 123.306 132.283 113.445 137.309 101.647C142.335 89.8491 143.207 76.7735 139.791 64.4462C136.375 52.1188 128.86 41.2279 118.412 33.4608C110.824 27.8197 101.996 24.0551 92.6881 22.4168C86.8452 21.3885 82 16.6746 82 10.742Z"
                      fill="#4057BD"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      style={{
                        fontFamily:
                          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#000",
                      }}
                    >
                      82%
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-center p-2" style={{ width: "100%" }}>
                  <div
                    className="font-semibold"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "17px",
                      color: "#000",
                    }}
                  >
                    44/53 beds occupied
                  </div>

                  <div className="mt-19 flex items-center justify-center gap-2">
                    <div
                      className="font-Poppins text-gray-900"
                      style={{
                        letterSpacing: "-0.154px",
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      <span className="text-[#10BA2A] font-semibold mr-1">
                        10%
                      </span>{" "}
                      vs last month
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-right">
                <a
                  href="#"
                  className="text-[#0F45A9] font-medium inline-block hover:underline"
                  style={{
                    fontFamily:
                      "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
                    fontSize: "15px",
                    fontWeight: 500,
                    lineHeight: "12.612px",
                    textDecoration: "none",
                  }}
                >
                  View Details →
                </a>
              </div>
            </div>

            <style>{`
              article:hover {
                transform: translateY(-6px) scale(1.02);
                box-shadow: 6px 8px 12px rgba(0,0,0,0.12);
                border: 0.7px solid #FF8F6B !important;
                z-index: 2;
              }
              article a:hover { text-decoration: underline; }
            `}</style>
          </article>{/* Active Guests - final: single-line title + exact vertical alignment to Occupancy */}
<article
  className="rounded-[30px] flex-shrink-0"
  style={{
    width: "261px",
    height: "487px",
    border: "1px solid rgba(79, 107, 227, 0.00)",
    background: "#FFF",
    boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.10)",
  }}
>
  <div
    className="h-full rounded-[20px] p-6 flex flex-col transition-transform duration-200"
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "#001433",
      fontFamily:
        "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      fontFeatureSettings: "'liga' off, 'clig' off",
      background: "transparent",
    }}
  >
    {/* Header — matched exactly with Occupancy (icon size, spacing). No mb-4 here */}
    <header
      className="flex flex-col items-center gap-3"
      style={{
        /* tighten/explicit the header height so the title baseline aligns with Occupancy */
        minHeight: "96px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="flex-shrink-0"
        style={{ width: "48px", height: "48px", aspectRatio: "1/1" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="w-full h-full"
          fill="none"
        >
          <path d="M13.125 11.375C13.125 15.7168 16.6582 19.25 21 19.25C25.3417 19.25 28.875 15.7168 28.875 11.375C28.875 7.03325 25.3417 3.5 21 3.5C16.6582 3.5 13.125 7.03325 13.125 11.375ZM35 36.75H36.75V35C36.75 28.2467 31.2533 22.75 24.5 22.75H17.5C10.745 22.75 5.25 28.2467 5.25 35V36.75H35Z" fill="#0B2595"/>
        </svg>
      </div>

      <h3
        className="font-semibold text-center"
        style={{
          color: "#001433",
          fontSize: "23px",
          fontWeight: 600,
          letterSpacing: "-0.154px",
          fontFamily: "Poppins, sans-serif",
          /* force single-line title exactly as Occupancy */
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Active Guests
      </h3>
    </header>

    {/* Chart area — original SVG kept exactly (no size/values changed). Put it in same vertical center area as Occupancy */}
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* wrap original svg in a centered container so its visual center lines up with Occupancy donut */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "270px", /* keep svg’s natural width container so svg renders as-is */ }}>
          {/* ORIGINAL graph SVG - untouched */}
          <svg viewBox="0 0 270 210" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            {/* left axis labels */}
            <g fontFamily="Nunito" fontSize="13" fill="#000" textAnchor="end" fontWeight="500">
              <text x="35" y="35">80</text>
              <text x="35" y="60">60</text>
              <text x="35" y="90">40</text>
              <text x="35" y="120">20</text>
              <text x="35" y="150">0</text>
            </g>

            {/* horizontal baseline width 210px */}
            <rect x="50" y="158" width="210" height="3" fill="#030229" opacity="0.08" rx="1" />

            {/* Group 1: Single */}
            <g className="bar-group" data-label="Single">
              <rect x="70" y={158 - (25 / 80) * 110} width="16" height={(25 / 80) * 110} fill="#4057BD" rx="2" />
              <rect x="95" y={158 - (20 / 80) * 110} width="16" height={(20 / 80) * 110} fill="#FFC107" rx="2" />
              <text x="78" y={158 - (25 / 80) * 110 - 6} fontFamily="Nunito" fontSize="12" fontWeight={500} fill="#000" textAnchor="middle">25</text>
              <text x="103" y={158 - (20 / 80) * 110 - 6} fontFamily="Nunito" fontSize="12" fontWeight={500} fill="#000" textAnchor="middle">20</text>
            </g>

            {/* Group 2: Double */}
            <g className="bar-group" data-label="Double">
              <rect x="135" y={158 - (50 / 80) * 110} width="16" height={(50 / 80) * 110} fill="#4057BD" rx="2" />
              <rect x="160" y={158 - (35 / 80) * 110} width="16" height={(35 / 80) * 110} fill="#FFC107" rx="2" />
              <text x="143" y={158 - (50 / 80) * 110 - 6} fontFamily="Nunito" fontSize="12" fontWeight={500} fill="#000" textAnchor="middle">50</text>
              <text x="168" y={158 - (35 / 80) * 110 - 6} fontFamily="Nunito" fontSize="12" fontWeight={500} fill="#000" textAnchor="middle">35</text>
            </g>

            {/* Group 3: Total */}
            <g className="bar-group" data-label="Total">
              <rect x="200" y={158 - (75 / 80) * 110} width="16" height={(75 / 80) * 110} fill="#4057BD" rx="2" />
              <rect x="225" y={158 - (55 / 80) * 110} width="16" height={(55 / 80) * 110} fill="#FFC107" rx="2" />
              <text x="208" y={158 - (75 / 80) * 110 - 6} fontFamily="Nunito" fontSize="12" fontWeight={500} fill="#000" textAnchor="middle">75</text>
              <text x="233" y={158 - (55 / 80) * 110 - 6} fontFamily="Nunito" fontSize="12" fontWeight={500} fill="#000" textAnchor="middle">55</text>
            </g>

            {/* x-axis labels */}
            <g fontFamily="Nunito" fontSize="13" fill="#000" textAnchor="middle" fontWeight="500">
              <text x="90" y="185">Single</text>
              <text x="160" y="185">Double</text>
              <text x="230" y="185">Total</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Legend - unchanged */}
      <div className="flex gap-4 mt-7 items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 ml-[-10px]" style={{ width: "10px", height: "10px", transform: "rotate(-90.749deg)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none" className="w-full h-full">
              <path d="M5.14354 10.0133C2.38212 10.0198 0.114272 7.78676 0.0781494 5.02557C0.0420271 2.26439 2.25131 0.0206852 5.01273 0.0141261C7.77415 0.00756694 10.042 2.24063 10.0781 5.00182C10.1142 7.76301 7.90496 10.0067 5.14354 10.0133Z" fill="#475EC4" />
            </svg>
          </div>
          <span className="font-semibold"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "14.4px", color: "#000" }}>
            Capacity
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-shrink-0" style={{ width: "10px", height: "10px", transform: "rotate(-90.749deg)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none" className="w-full h-full">
              <path d="M5.13085 10.0111C2.36943 10.0176 0.101576 7.78456 0.0654541 5.02338C0.0293318 2.26219 2.23862 0.0184879 5.00003 0.0119288C7.76145 0.00536968 10.0293 2.23844 10.0654 4.99962C10.1015 7.76081 7.89226 10.0045 5.13085 10.0111Z" fill="#FFD66B" />
            </svg>
          </div>
           <span className="font-semibold"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "14.6px", color: "#000" }}>
            Active Guest
          </span>
        </div>
      </div>

      {/* Stats + percent row — exact same structure & spacing as Occupancy so baseline matches */}
      <div className="mt-15 text-center p-2" style={{ width: "100%" }}>
        <div className=" flex items-center justify-center gap-2">
       
          <div
            style={{
              letterSpacing: "-0.154px",
              mt:"8px",
              fontSize:"15px",
              fontWeight:"500"
            }}
            className="font-Poppins text-gray-900"
          >
            <span className="text-[#10BA2A] font-semibold mr-1 ">7%</span> vs last month
          </div>
        </div>
      </div>
    </div>

    {/* Footer link — same placement & style as Occupancy card */}
    <div className="mt-0 text-right">
      <a
        href="#"
        className="text-[#0F45A9] font-medium inline-block hover:underline"
        style={{
          fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
          fontSize: "15px",
          fontWeight: 500,
          lineHeight: "12.612px",
          textDecoration: "none",
        }}
            onClick={(e) => {
        e.preventDefault();   // stop page reload
        navigate("./GuestInsights");
      }}
      >
        View Details →
      </a>
    </div>
  </div>

  {/* Hover + card-specific CSS (scoped via .active-guests-card) */}
  <style>{`
    /* scope hover to only this card */
    .active-guests-card:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 6px 8px 12px rgba(0,0,0,0.12);
      border: 0.7px solid #FF8F6B !important;
      z-index: 2;
    }

    /* disable per-bar hover transforms so chart stays static and no jitter */
    .active-guests-card svg .bar-group rect,
    .active-guests-card svg .bar-group text {
      transition: none !important;
      transform: none !important;
    }

    .active-guests-card a:hover { text-decoration: underline; }
  `}</style>
</article>




{/* Revenue Card (Improved Orientation) */}
<article
   className="rounded-[30px] flex-shrink-0"
  style={{
    width: "261px",
    height: "487px",
    border: "1px solid rgba(79, 107, 227, 0.00)",
    background: "#FFF",
    boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.10)",
  }}
>
  <div
    className="h-full rounded-[30px] p-6 flex flex-col"
    style={{
      justifyContent: "space-between",
      color: "#001433",
      fontFamily:
        "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      background: "transparent",
    }}
  >
    {/* Header */}
    <header className="flex flex-col items-center gap-3">
      <div
        style={{
          width: "42px",
          height: "42px",
        }}
      >
        {/* icon */}
             <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
  <path d="M35.4375 21.4252C36.8716 20.2907 37.9846 18.8013 38.6662 17.1045C39.137 18.466 39.3732 19.999 39.375 21.7035C39.375 25.7775 37.9365 28.6335 36.4613 30.471C35.786 31.316 35.0002 32.0665 34.125 32.7022V35.4375C34.125 36.4818 33.7102 37.4833 32.9717 38.2217C32.2333 38.9601 31.2318 39.375 30.1875 39.375H28.875C28.1788 39.375 27.5111 39.0984 27.0188 38.6061C26.5266 38.1139 26.25 37.4462 26.25 36.75H21C21 37.4462 20.7234 38.1139 20.2312 38.6061C19.7389 39.0984 19.0712 39.375 18.375 39.375H17.0625C16.0182 39.375 15.0167 38.9601 14.2783 38.2217C13.5398 37.4833 13.125 36.4818 13.125 35.4375V34.8784C11.449 34.3433 9.92705 33.4113 8.68875 32.1615C7.13737 30.5839 6.26588 28.6125 5.8275 27.3761C5.77641 27.2058 5.68582 27.05 5.56312 26.9214C5.44041 26.7928 5.28905 26.6949 5.12137 26.6359C4.40397 26.4314 3.77249 25.9993 3.32219 25.4046C2.87189 24.8098 2.62719 24.0848 2.625 23.3389V21.2546C2.625 19.7426 3.62775 18.4144 5.07937 17.9996C5.35237 17.9209 5.64638 17.6557 5.79075 17.2174C6.14513 16.149 6.825 14.5687 8.0745 13.3035C9.14911 12.2268 10.379 11.3172 11.7233 10.605V5.67786C11.7248 5.27889 11.8459 4.88955 12.071 4.56012C12.2961 4.2307 12.6148 3.97633 12.9859 3.82986C13.3466 3.67865 13.7435 3.63536 14.1284 3.70526C14.5133 3.77515 14.8696 3.95521 15.1541 4.22361C15.8182 4.85099 16.6897 5.59911 17.6216 6.21074C18.5797 6.83811 19.4775 7.23449 20.2099 7.30799H20.223C18.8156 9.3917 18.2027 11.9113 18.4958 14.4086C18.8134 17.1097 20.9029 18.732 22.6564 19.4591L28.9301 22.0552C30.681 22.7824 33.306 23.1105 35.4401 21.4252M12.4688 19.6875C12.9909 19.6875 13.4917 19.4801 13.8609 19.1109C14.2301 18.7416 14.4375 18.2409 14.4375 17.7187C14.4375 17.1966 14.2301 16.6958 13.8609 16.3266C13.4917 15.9574 12.9909 15.75 12.4688 15.75C11.9466 15.75 11.4458 15.9574 11.0766 16.3266C10.7074 16.6958 10.5 17.1966 10.5 17.7187C10.5 18.2409 10.7074 18.7416 11.0766 19.1109C11.4458 19.4801 11.9466 19.6875 12.4688 19.6875ZM21.6037 10.29C22.0487 9.16669 22.7462 8.16084 23.6422 7.35029C24.5382 6.53975 25.6087 5.94624 26.7709 5.61571C27.933 5.28518 29.1556 5.2265 30.3441 5.44419C31.5326 5.66189 32.655 6.15012 33.6245 6.87112C34.594 7.59211 35.3847 8.52653 35.9352 9.60205C36.4857 10.6776 36.7814 11.8653 36.7993 13.0734C36.8173 14.2815 36.557 15.4775 36.0386 16.5689C35.5202 17.6603 34.7577 18.6178 33.81 19.3672C32.718 20.2282 31.2191 20.1626 29.9329 19.6297L23.6591 17.031C22.3729 16.5007 21.2651 15.4849 21.1024 14.1041C21.0252 13.4355 21.034 12.7597 21.1286 12.0934L21.6037 10.29ZM21.6037 10.29L21.2467 11.4397C21.3362 11.0479 21.4556 10.6636 21.6037 10.29Z" fill="#0B2595"/>
</svg>

      </div>
      <h3
        className="font-semibold text-center"
        style={{
          color: "#001433",
          fontSize: "23px",
          fontWeight: 600,
          letterSpacing: "-0.154px",
        }}
      >
        Revenue
      </h3>
     
    </header>

    {/* Chart */}
    <div className="flex-1 flex items-start justify-center mt-6">
      <div className="relative w-full" style={{ maxWidth: 220 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 2px 1fr",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Labels */}
        <div
  className="flex-1 flex flex-col items-start justify-start space-y-2"
  style={{ marginTop: "-37px" }} // You can adjust this value as needed
>
  <div>Profit</div>
  <div>Expense</div>
  <div>Revenue</div>
</div>
          {/* Baseline */}
          <div className="w-[2px] h-[144px] bg-[#030229]/10 mt-1" />

          {/* Bars & Values */}
          <div className="flex flex-col justify-between h-[144px] font-[Nunito] text-sm font-medium text-black">
            {/* Profit */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#FF794E] h-[16px] max-w-[44px]"></div>
              <span>200</span>
            </div>
            {/* Expense */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#FFC107] h-[16px] max-w-[67px]"></div>
              <span>300</span>
            </div>
            {/* Revenue */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#4057BD] h-[16px] max-w-[121px]"></div>
              <span>500</span>
            </div>

            {/* X-axis */}
            <div className="flex justify-between mt-2 text-[15px]">
              <span>0</span>
              <span>200</span>
              <span>400</span>
              <span>600</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-7">
            <div className="font-semibold"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "14.4px", color: "#000" }}>INR in K</div>
        </div>
       
      </div>
      
    </div>

    {/* Percent Row */}
    <div className="mt-6 text-center">
      <div className="flex items-center justify-center gap-2">
        
        <div className="text-[15px] mt-[-20px] font-Poppins font-medium text-gray-900 " style={{letterSpacing: "-0.154px"}} >
          <span className="text-[#D11A2A] font-semibold mr-1">8%</span> vs last
          month
        </div>
      </div>
    </div>

    {/* Footer link */}
    <div className="mt-4 text-right">
      <a
        href="#"
        className="text-[#0F45A9] font-medium hover:underline"
        style={{ fontSize: "15px" }}
      >
        View Details →
      </a>
    </div>
  </div>

  {/* Hover */}
  <style>{`
    .revenue-card:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 6px 8px 12px rgba(0,0,0,0.12);
      border: 0.7px solid #FF8F6B !important;
      z-index: 2;
    }
  `}</style>
</article>



       {/* Overdue */}
<article
  className="rounded-[30px] flex-shrink-0"
  style={{
    width: "261px",
    height: "487px",
    border: "1px solid rgba(79, 107, 227, 0.00)",
    background: "#FFF",
    boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.10)",
  }}
>
  <div
    className="h-full rounded-[30px] p-6 flex flex-col shadow-sm transition-transform duration-300"
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "#001433",
      fontFamily: "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      fontFeatureSettings: "'liga' off, 'clig' off",
    }}
  >
    {/* Header: alert icon + title */}
    <header className="flex flex-col items-center gap-3">
      <div
        className="flex-shrink-0"
        style={{ width: "42px", height: "42px", aspectRatio: "1/1" }}
      >
        {/* Alert SVG (provided) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="w-full h-full">
          <path d="M22.5151 5.25004L39.1856 34.125C39.3392 34.3911 39.42 34.6929 39.42 35C39.42 35.3072 39.3392 35.609 39.1856 35.875C39.032 36.1411 38.8111 36.362 38.545 36.5156C38.279 36.6692 37.9772 36.75 37.6701 36.75H4.32906C4.02187 36.75 3.7201 36.6692 3.45407 36.5156C3.18805 36.362 2.96714 36.1411 2.81355 35.875C2.65996 35.609 2.5791 35.3072 2.5791 35C2.5791 34.6929 2.65996 34.3911 2.81356 34.125L19.4841 5.25004C19.6377 4.98403 19.8586 4.76314 20.1246 4.60956C20.3906 4.45597 20.6924 4.37512 20.9996 4.37512C21.3067 4.37512 21.6085 4.45597 21.8745 4.60956C22.1405 4.76314 22.3615 4.98403 22.5151 5.25004ZM19.2496 28V31.5H22.7496V28H19.2496ZM19.2496 15.75V24.5H22.7496V15.75H19.2496Z" fill="#0B2595"/>
        </svg>
      </div>

      <h3
        className="font-semibold text-center"
        style={{
          fontSize: "23px",
          fontWeight: 600,
          letterSpacing: "-0.154px",
          color: "#001433",
        }}
      >
        Overdue
      </h3>
    </header>

    {/* Pie (donut) + center value */}
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="relative" style={{ width: "163px", height: "162px", flexShrink: 0 }}>
        {/* Provided pie SVG scaled into 163x162 box */}
        <svg xmlns="http://www.w3.org/2000/svg" width="163" height="162" viewBox="0 0 163 162" fill="none" className="w-full h-full">
          <path d="M163 81C163 125.735 126.511 162 81.5 162C36.4888 162 0 125.735 0 81C0 36.2649 36.4888 0 81.5 0C126.511 0 163 36.2649 163 81ZM23.748 81C23.748 112.7 49.6045 138.398 81.5 138.398C113.396 138.398 139.252 112.7 139.252 81C139.252 49.3001 113.396 23.6023 81.5 23.6023C49.6045 23.6023 23.748 49.3001 23.748 81Z" fill="#FFD66B"/>
          <path d="M52.7342 144.119C50.0462 150.017 43.036 152.703 37.5669 149.224C24.1823 140.711 13.5161 128.44 7.00264 113.849C0.505234 99.2934 -1.49663 83.243 1.10536 67.7034C2.18144 61.2768 8.9149 57.8628 15.1232 59.8417C21.363 61.8307 24.665 68.5269 23.9819 75.0403C22.9409 84.9657 24.5117 95.0621 28.6391 104.308C32.7793 113.583 39.2839 121.536 47.4215 127.435C52.7038 131.265 55.4398 138.182 52.7342 144.119Z" fill="#FF794E"/>
          <path d="M81.5 12.0841C81.5 5.41023 86.939 -0.0912485 93.5405 0.88882C102.248 2.18155 110.714 4.87206 118.601 8.87934C130.086 14.7155 140.014 23.1779 147.567 33.5706C155.12 43.9634 160.084 55.9897 162.049 68.6605C164.014 81.3313 162.925 94.2848 158.871 106.456C154.817 118.627 147.914 129.667 138.73 138.67C129.546 147.673 118.342 154.38 106.042 158.24C93.7407 162.101 80.6935 163.004 67.9728 160.876C59.2777 159.422 50.9049 156.579 43.1704 152.483C37.2352 149.339 36.144 141.624 40.1675 136.246C44.1575 130.913 51.6759 129.941 57.7408 132.694C62.2696 134.75 67.065 136.217 72.0089 137.044C80.9341 138.537 90.0884 137.903 98.719 135.194C107.35 132.485 115.21 127.779 121.654 121.463C128.098 115.146 132.941 107.4 135.785 98.8604C138.63 90.321 139.394 81.2325 138.015 72.3423C136.636 63.4521 133.154 55.0141 127.854 47.7223C122.555 40.4304 115.589 34.493 107.531 30.3982C103.075 28.134 98.3551 26.4689 93.4955 25.4327C86.9684 24.0409 81.5 18.758 81.5 12.0841Z" fill="#4057BD"/>
        </svg>

        {/* center amount */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ fontFamily: "Nunito, sans-serif", fontSize: "18px", fontWeight: 700, color: "#000" }}>
            ₹1,15,000
          </div>
        </div>
      </div>

      {/* Legend: three lines */}
      <div className="mt-4 flex flex-col items-start gap-3 w-full px-6">
        <div className="flex items-center gap-3">
          <div style={{ width: "10px", height: "10px", borderRadius: 9999 }} className="bg-[#5B93FF]" />
          <div className="font-semibold"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "14.4px", color: "#000" }}>
            &lt; 15 Days - 55%
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div style={{ width: "10px", height: "10px", borderRadius: 9999 }} className="bg-[#FF8F6B]" />
          <div className="font-semibold"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "14.4px", color: "#000" }}>
            15–30 Days - 25%
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div style={{ width: "10px", height: "10px", borderRadius: 9999 }} className="bg-[#FFD66B]" />
          <div className="font-semibold"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "14.4px", color: "#000" }}>
            &gt; 30 Days - 20%
          </div>
        </div>
      </div>
    </div>

    {/* percent row: red down arrow + text */}
    <div className="mt-4 text-center" >
      
      <span className="font-semibold text-[#D11A2A] mr-2">5%</span>
      <span class="font-Poppins   text-black" style={{fontWeight: 500,letterSpacing: "-0.154px",fontSize:"15px"}} >vs last month</span>
    </div>

    {/* footer link */}
    <div className="mt-4 text-right">
      <a href="#"
         className="text-[#0F45A9] font-medium inline-block"
         style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 500, lineHeight: "12.612px", textDecoration: "none" }}>
        View Details →
      </a>
    </div>
  </div>

  {/* hover pop + link underline on hover */}
  <style>{`
    article:hover > div {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 6px 8px 12px rgba(0,0,0,0.12);
    }
    a:hover { text-decoration: underline; }
  `}</style>
</article>
</div>
</section>
    </div>
  );
}


//           {/* Active Guests ... continue remaining code here WITHOUT UI CHANGES */}
//           {/* The rest should be converted the same way with types & jsx fixes */}
//         </div>
//       </section>
//     </div>
//   );
// }
