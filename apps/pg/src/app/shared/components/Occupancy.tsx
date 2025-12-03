// OccupancyPage.tsx
import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowLeft } from "lucide-react";

// ---------- Reusable UI Components ----------
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow-[8px_8px_8px_0px_rgba(0,0,0,0.25)] ${className}`}
  >
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`mb-2 flex justify-between items-center ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <h2 className={`text-lg font-semibold text-gray-800 ${className}`}>
    {children}
  </h2>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, active = false, ...props }) => (
  <button
    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    {...props}
  >
    {children}
  </button>
);

// ---------- Types ----------
interface Bed {
  room: string;
  bed: string;
  status: "Occupied" | "Vacant" | "Reserved";
  guest: string;
  checkin: string;
  checkout: string;
  rent: string;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface DurationData {
  label: string;
  value: number;
}

// ---------- Main Page ----------
const OccupancyPage: React.FC = () => {
  const [duration, setDuration] = useState<"month" | "quarter" | "year">("month");
  const [filter, setFilter] = useState<"all" | "occupied" | "vacant" | "reserved">("all");

  const occupancyCount = { occupied: 30, total: 53 };
  const occupancyPercent = Math.round(
    (occupancyCount.occupied / occupancyCount.total) * 100
  );

  // Donut Data
  const categoryData: CategoryData[] = [
    { name: "Single sharing", value: 50, color: "#3b82f6" },
    { name: "Double sharing", value: 20, color: "#facc15" },
    { name: "Triple sharing", value: 10, color: "#fb7185" },
  ];

  // Bar Chart Data
  const durationOptions: Record<string, DurationData[]> = {
    month: [
      { label: "Week 1", value: 40 },
      { label: "Week 2", value: 55 },
      { label: "Week 3", value: 62 },
      { label: "Week 4", value: 70 },
    ],
    quarter: [
      { label: "Apr", value: 50 },
      { label: "May", value: 55 },
      { label: "Jun", value: 65 },
      { label: "Jul", value: 62 },
      { label: "Aug", value: 67 },
      { label: "Sep", value: 72 },
    ],
    year: [
      { label: "Jan", value: 48 },
      { label: "Feb", value: 50 },
      { label: "Mar", value: 52 },
      { label: "Apr", value: 55 },
      { label: "May", value: 58 },
      { label: "Jun", value: 60 },
      { label: "Jul", value: 62 },
      { label: "Aug", value: 64 },
      { label: "Sep", value: 67 },
      { label: "Oct", value: 70 },
      { label: "Nov", value: 72 },
      { label: "Dec", value: 75 },
    ],
  };

  // Table Data
  const allBeds: Bed[] = [
    {
      room: "101",
      bed: "A",
      status: "Occupied",
      guest: "Rohan Gupta",
      checkin: "01 July, 2025",
      checkout: "20 Sep, 2025",
      rent: "8,000",
    },
    {
      room: "101",
      bed: "B",
      status: "Vacant",
      guest: "-",
      checkin: "-",
      checkout: "-",
      rent: "8,000",
    },
    {
      room: "102",
      bed: "A",
      status: "Reserved",
      guest: "Sharath Kumar",
      checkin: "01 Aug, 2025",
      checkout: "-",
      rent: "8,000",
    },
  ];

  const filteredBeds = filter === "all"
    ? allBeds
    : allBeds.filter((b) => b.status.toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-[#E7EFF7] p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Occupancy
        </h1>
        <button className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Radial Occupancy Card */}
        <Card className="relative w-full h-67 overflow-hidden border border-gray-200 hover:border-blue-500">
          {/* Rotating Pie chart */}
          <div className="absolute top-[48px] left-0 w-48 h-44 animate-spin-slow mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "occupied", value: occupancyPercent },
                    { name: "remaining", value: 100 - occupancyPercent },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  startAngle={0}
                  endAngle={360}
                  dataKey="value"
                  paddingAngle={0}
                >
                  <Cell fill="#5B93FF" />
                  <Cell fill="#D5F8FF" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-xl font-extrabold font-['Inter'] text-black">
                {occupancyCount.occupied}/{occupancyCount.total}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="absolute top-6 left-7 text-lg font-semibold font-['Poppins'] text-black">
            Occupancy by Bed
          </div>

          {/* Subtext */}
          <div className="absolute top-[65px] left-[248px] text-xl font-bold font-['Inter'] text-black mt-4">
            {occupancyCount.occupied} of {occupancyCount.total} beds occupied
          </div>

          {/* Percentage */}
          <div className="absolute top-[101px] left-[312px] text-5xl font-extrabold font-['Inter'] text-black mt-4">
            {occupancyPercent}%
          </div>

          {/* Monthly Change */}
          <div className="absolute top-[165px] left-[269px] text-xl font-normal font-['Inter'] text-green-600 mt-4">
            +5% since last month
          </div>

          {/* Highlight background */}
          <div className="absolute top-6 left-3 w-50 h-7 bg-sky-600 opacity-10 rounded-[10px] backdrop-blur-[2px]" />
        </Card>

        {/* Category Donut Card */}
        <Card className="relative w-full h-67 border border-gray-200 hover:border-blue-500">
          {/* Highlight background */}
          <div className="absolute top-6 left-3 w-62 h-7 bg-sky-600 opacity-10 rounded-[10px] backdrop-blur-[2px]" />
          <CardHeader>
            <CardTitle>Occupancy by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-4 flex gap-6 items-center">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="90%"
                      dataKey="value"
                      paddingAngle={0}
                    >
                      {categoryData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <ul className="space-y-3">
                  {categoryData.map((c, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: c.color }}
                        />
                        <div className="text-sm text-gray-700">{c.name}</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        {c.value}%
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Duration Bar Chart */}
        <Card className="relative w-full h-67 border border-gray-200 hover:border-blue-500">
          {/* Highlight background */}
          <div className="absolute top-6 left-3 w-62 h-7 bg-sky-600 opacity-10 rounded-[10px] backdrop-blur-[2px]" />
          <CardHeader>
            <CardTitle>Occupancy by Duration</CardTitle>
            <div className="flex gap-2">
              <Button active={duration === "month"} onClick={() => setDuration("month")}>
                Month
              </Button>
              <Button active={duration === "quarter"} onClick={() => setDuration("quarter")}>
                Quarter
              </Button>
              <Button active={duration === "year"} onClick={() => setDuration("year")}>
                Year
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationOptions[duration]} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b" }} />
                  <YAxis tick={{ fill: "#64748b" }} />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                    activeBar={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Card */}
        <Card className="w-full h-67 relative border border-gray-200 hover:border-blue-500">
          <div className="absolute top-6 left-5 w-[236px] h-[29px] bg-[#0068DD] opacity-10 rounded-lg blur-[2px]" />
          <CardTitle className="text-lg font-semibold text-black mb-4">
            Occupancy by Forecast
          </CardTitle>
          <div className="h-full flex flex-col items-center justify-start text-center px-3 mt-10">
            <p className="text-xl font-bold text-black">
              Next month projected Occupancy:
            </p>
            <div className="text-5xl font-extrabold text-black mt-2">90%</div>
            <p className="text-lg font-medium text-black mt-4">
              48 out of 53 beds booked.
            </p>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Occupancy by Bed/Room</CardTitle>
          <div className="flex gap-3">
            <Button active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </Button>
            <Button active={filter === "occupied"} onClick={() => setFilter("occupied")}>
              Occupied
            </Button>
            <Button active={filter === "vacant"} onClick={() => setFilter("vacant")}>
              Vacant
            </Button>
            <Button active={filter === "reserved"} onClick={() => setFilter("reserved")}>
              Reserved
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-blue-600 text-white text-left px-6 py-3">Room ID</th>
                  <th className="bg-blue-600 text-white text-left px-6 py-3">Bed ID</th>
                  <th className="bg-blue-600 text-white text-left px-6 py-3">Status</th>
                  <th className="bg-blue-600 text-white text-left px-6 py-3">Guest Name</th>
                  <th className="bg-blue-600 text-white text-left px-6 py-3">Check-in Date</th>
                  <th className="bg-blue-600 text-white text-left px-6 py-3">Check-out Date</th>
                  <th className="bg-blue-600 text-white text-left px-6 py-3">Rent</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeds.map((bed, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-6 py-4">{bed.room}</td>
                    <td className="px-6 py-4">{bed.bed}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs px-3 py-1 rounded-full ${
                          bed.status === "Occupied"
                            ? "bg-emerald-100 text-emerald-700"
                            : bed.status === "Vacant"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {bed.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{bed.guest}</td>
                    <td className="px-6 py-4">{bed.checkin}</td>
                    <td className="px-6 py-4">{bed.checkout}</td>
                    <td className="px-6 py-4">{bed.rent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OccupancyPage;