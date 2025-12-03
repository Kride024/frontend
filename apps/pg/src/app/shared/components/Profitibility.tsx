// Profitibility.tsx
import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface RoomData {
  name: string;
  value: number;
  color: string;
}

interface ExpenseData {
  name: string;
  value: number;
  color: string;
}

interface LineDataPoint {
  month: string;
  value: number;
}

interface RevenueRow {
  month: string;
  collected: string;
  expected: string;
  profitPercent: string;
  netProfit: string;
}

export default function Profitibility() {
  // Keep original colors
  const roomsData: RoomData[] = [
    { name: "Single Sharing", value: 60, color: "#4f8ef7" },
    { name: "Double Sharing", value: 45, color: "#f3cb5a" },
    { name: "Triple Sharing", value: 30, color: "#f8957b" },
  ];

  const expensesData: ExpenseData[] = [
    { name: "Maintenance", value: 6, color: "#4f8ef7" },
    { name: "Food", value: 34, color: "#f3cb5a" },
    { name: "Salaries", value: 42, color: "#f8957b" },
    { name: "Utilities", value: 12, color: "#7aff6c" },
    { name: "Other", value: 6, color: "#d8d2cd" },
  ];

  const [nextMonthForecast] = useState("₹3,10,000");
  const [utilityExceededPercent] = useState(20);

  const lineData: LineDataPoint[] = [
    { month: "Jan", value: 12 },
    { month: "Feb", value: 34 },
    { month: "Mar", value: 26 },
    { month: "Apr", value: 27 },
    { month: "May", value: 58 },
    { month: "Jun", value: 48 },
    { month: "Jul", value: 42 },
    { month: "Aug", value: 46 },
    { month: "Sep", value: 65 },
    { month: "Oct", value: 66 },
  ];

  const revenueData: RevenueRow[] = [
    { month: "March 2025", collected: "₹5,20,000", expected: "₹2,35,000", profitPercent: "54%", netProfit: "₹1,46,660" },
    { month: "April 2025", collected: "₹4,80,000", expected: "₹2,50,000", profitPercent: "48%", netProfit: "₹46,660" },
    { month: "May 2025", collected: "₹5,20,000", expected: "₹2,35,000", profitPercent: "54%", netProfit: "₹3,46,676" },
    { month: "June 2025", collected: "₹5,20,000", expected: "₹2,35,000", profitPercent: "54%", netProfit: "₹3,46,981" },
  ];

  // % tooltip helpers
  const roomsTotal = useMemo(() => roomsData.reduce((s, d) => s + d.value, 0), [roomsData]);
  const expensesTotal = useMemo(() => expensesData.reduce((s, d) => s + d.value, 0), [expensesData]);

  const tooltipStyles = {
    wrapperStyle: { border: "1px solid #e2e8f0", borderRadius: 8 },
    contentStyle: { background: "rgba(255,255,255,0.98)", border: "none", borderRadius: 8, boxShadow: "0 6px 16px rgba(2,6,23,0.06)" },
    labelStyle: { color: "#0f172a" },
    itemStyle: { color: "#334155" },
  };

  const makeFormatter = (total: number) => (value: number, name: string) => {
    const pct = total ? (value / total) * 100 : 0;
    return [`${value} (${pct.toFixed(1)}%)`, name];
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 w-full bg-gradient-to-br from-[#eff6ff] via-[#f7fbff] to-white min-h-screen max-w-screen-xl mx-auto">
      {/* Left */}
      <div className="flex flex-col flex-1 space-y-8 bg-white/90 backdrop-blur-sm ring-1 ring-[#dbeafe] p-6 rounded-2xl shadow-sm">
        {/* Heading */}
        <header className="mb-2">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Profitability</h1>
          <p className="text-sm text-slate-600">Overview of revenue, expenses and room sharing analytics</p>
        </header>

        {/* Mobile donuts */}
        <div className="space-y-6 md:hidden">
          {/* Rooms */}
          <section className="p-4 rounded-xl border border-[#e5edff] hover:shadow-md transition-all">
            <h2 className="text-sm font-semibold text-slate-600 mb-2">Analytics By Rooms Sharing</h2>
            <div className="flex items-center">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <defs>
                    <filter id="pieShadow" height="130%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  <Pie
                    data={roomsData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={4}
                    stroke="white"
                    strokeWidth={2}
                    style={{ filter: "url(#pieShadow)" }}
                  >
                    {roomsData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={makeFormatter(roomsTotal)}
                    wrapperStyle={tooltipStyles.wrapperStyle}
                    contentStyle={tooltipStyles.contentStyle}
                    labelStyle={tooltipStyles.labelStyle}
                    itemStyle={tooltipStyles.itemStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="ml-4 text-xs flex flex-col gap-1 max-w-[140px]">
                {roomsData.map(({ name, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="inline-block w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-slate-700">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Expenses */}
          <section className="p-4 rounded-xl border border-[#e5edff] hover:shadow-md transition-all">
            <h2 className="text-sm font-semibold text-slate-600 mb-2">Expenses Breakdown</h2>
            <div className="flex items-center">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={expensesData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={4}
                    stroke="white"
                    strokeWidth={2}
                    style={{ filter: "url(#pieShadow)" }}
                  >
                    {expensesData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={makeFormatter(expensesTotal)}
                    wrapperStyle={tooltipStyles.wrapperStyle}
                    contentStyle={tooltipStyles.contentStyle}
                    labelStyle={tooltipStyles.labelStyle}
                    itemStyle={tooltipStyles.itemStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="ml-4 text-xs flex flex-col gap-1 max-w-[140px]">
                {expensesData.map(({ name, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="inline-block w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-slate-700">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Line chart */}
        <section className="w-full h-78 p-8 rounded-xl border border-[#e5edff] hover:shadow-md transition-all">
          <h2 className="text-sm font-semibold text-slate-600 mb-3">Monthly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 20, left: -24, bottom: 8 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                wrapperStyle={tooltipStyles.wrapperStyle}
                contentStyle={tooltipStyles.contentStyle}
                labelStyle={tooltipStyles.labelStyle}
                itemStyle={tooltipStyles.itemStyle}
              />
              <Legend />
              <Line
                name="Revenue Index"
                type="monotone"
                dataKey="value"
                stroke="url(#revGradient)"
                strokeWidth={3}
                dot={{ stroke: "#2563EB", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Improved Table */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-slate-800">Recent Monthly Revenue</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-[#eaf2ff] text-[#2563EB] font-medium">
              Latest 4 months
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-[#e5edff] shadow-sm mt-3">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="sticky top-0 bg-[#2563EB] text-white uppercase text-xs tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 border-b border-[#e5edff]">Month</th>
                    <th className="py-3.5 px-4 border-b border-[#e5edff]">Revenue Collected</th>
                    <th className="py-3.5 px-4 border-b border-[#e5edff]">Revenue Expected</th>
                    <th className="py-3.5 px-4 border-b border-[#e5edff]">Net Profit</th>
                    <th className="py-3.5 px-4 border-b border-[#e5edff] text-right">Profit %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef3ff]">
                  {revenueData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="bg-white hover:bg-[#f0f6ff] transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-800">{row.month}</td>
                      <td className="py-3 px-4 text-slate-700">{row.collected}</td>
                      <td className="py-3 px-4 text-slate-700">{row.expected}</td>
                      <td className="py-3 px-4 font-semibold text-[#2563EB]">{row.netProfit}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#eaf2ff] text-[#1d4ed8] font-semibold">
                          {row.profitPercent}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Right (desktop) */}
      <div className="hidden md:flex flex-col gap-6 w-96">
        <div className="bg-white/90 ring-1 ring-[#dbeafe] p-6 rounded-2xl text-center hover:shadow-md transition-all">
          <h3 className="text-sm font-semibold text-slate-600 mb-1">Next month profit forecast</h3>
          <p className="text-3xl font-extrabold mb-1 tracking-tight text-slate-900">{nextMonthForecast}</p>
          <p className="text-xs text-slate-600">
            Utility expenses exceeded by <span className="font-semibold text-[#2563EB]">{utilityExceededPercent}%</span>
          </p>
        </div>

        {/* Rooms pie */}
        <div className="bg-white/90 ring-1 ring-[#dbeafe] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Analytics By Rooms Sharing</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <defs>
                <filter id="pieShadowDesk" height="130%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                </filter>
              </defs>
              <Pie
                data={roomsData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={4}
                stroke="white"
                strokeWidth={2}
                style={{ filter: "url(#pieShadowDesk)" }}
              >
                {roomsData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip
                formatter={makeFormatter(roomsTotal)}
                wrapperStyle={tooltipStyles.wrapperStyle}
                contentStyle={tooltipStyles.contentStyle}
                labelStyle={tooltipStyles.labelStyle}
                itemStyle={tooltipStyles.itemStyle}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {roomsData.map(({ name, color }) => (
              <span key={name} className="inline-flex items-center gap-2">
                <i className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-slate-700">{name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Expenses pie */}
        <div className="bg-white/90 ring-1 ring-[#dbeafe] p-6 rounded-2xl hover:shadow-md transition-all">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Expenses Breakdown</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={expensesData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={4}
                stroke="white"
                strokeWidth={2}
                style={{ filter: "url(#pieShadowDesk)" }}
              >
                {expensesData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip
                formatter={makeFormatter(expensesTotal)}
                wrapperStyle={tooltipStyles.wrapperStyle}
                contentStyle={tooltipStyles.contentStyle}
                labelStyle={tooltipStyles.labelStyle}
                itemStyle={tooltipStyles.itemStyle}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {expensesData.map(({ name, color }) => (
              <span key={name} className="inline-flex items-center gap-2">
                <i className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-slate-700">{name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}