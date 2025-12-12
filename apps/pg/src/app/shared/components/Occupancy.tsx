// OccupancyPage.tsx
import React, { useState, useRef } from "react";
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
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react"; 

// ---------------------------------------------------------------------
// 1. Reusable UI Components
// ---------------------------------------------------------------------

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow-xl ${className}`} 
  >
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <h2 className={`text-xl font-semibold text-gray-800 ${className}`}>
    {children}
  </h2>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="pt-2 flex-grow">{children}</div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, active = false, ...props }) => (
  <button
    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
      active
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
    {...props}
  >
    {children}
  </button>
);

// ---------------------------------------------------------------------
// 2. Types and Data
// ---------------------------------------------------------------------

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

const categoryData: CategoryData[] = [
    { name: "Single sharing", value: 50, color: "#3b82f6" },
    { name: "Double sharing", value: 20, color: "#facc15" },
    { name: "Triple sharing", value: 10, color: "#fb7185" },
];

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

const allBeds: Bed[] = [
    { room: "101", bed: "A", status: "Occupied", guest: "Rohan Gupta", checkin: "01 July, 2025", checkout: "20 Sep, 2025", rent: "8,000" },
    { room: "101", bed: "B", status: "Vacant", guest: "-", checkin: "-", checkout: "-", rent: "8,000" },
    { room: "102", bed: "A", status: "Reserved", guest: "Sharath Kumar", checkin: "01 Aug, 2025", checkout: "-", rent: "8,000" },
    { room: "102", bed: "B", status: "Occupied", guest: "Priya Sharma", checkin: "05 July, 2025", checkout: "01 Oct, 2025", rent: "8,000" },
    { room: "103", bed: "A", status: "Vacant", guest: "-", checkin: "-", checkout: "-", rent: "7,500" },
    { room: "103", bed: "B", status: "Occupied", guest: "Amit Varma", checkin: "10 June, 2025", checkout: "01 Dec, 2025", rent: "7,500" },
    { room: "104", bed: "A", status: "Reserved", guest: "Nikita Jain", checkin: "15 Sep, 2025", checkout: "-", rent: "8,500" },
];

// ---------------------------------------------------------------------
// 3. Main Page
// ---------------------------------------------------------------------

const OccupancyPage: React.FC = () => {
  const [duration, setDuration] = useState<"month" | "quarter" | "year">("month");
  const [filter, setFilter] = useState<"all" | "occupied" | "vacant" | "reserved">("all");
  
  const carouselRef = useRef<HTMLDivElement>(null); 

  const occupancyCount = { occupied: 30, total: 53 };
  const occupancyPercent = Math.round(
    (occupancyCount.occupied / occupancyCount.total) * 100
  );

  const filteredBeds = filter === "all"
    ? allBeds
    : allBeds.filter((b) => b.status.toLowerCase() === filter);

  const scrollCards = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      // Determine scroll amount based on current screen size to align better with the larger card width (400px)
      const isLargeScreen = window.innerWidth >= 1024; // Check if screen is large (lg breakpoint)
      const cardWidth = isLargeScreen ? 400 : 320;
      const gap = 16; // gap-4 is 16px
      
      const scrollAmount = direction === 'right' 
        ? cardWidth + gap
        : -(cardWidth + gap);
      
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#E7EFF7] p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Occupancy Dashboard
        </h1>
        <button className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm md:text-base">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Card Carousel Wrapper (Universal Scroll) */}
      <div className="relative mb-6">
        
        {/* Navigation Arrows */}
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow-lg hidden sm:block text-blue-600 hover:bg-white transition-colors"
          onClick={() => scrollCards('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow-lg hidden sm:block text-blue-600 hover:bg-white transition-colors"
          onClick={() => scrollCards('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>

        {/* Card Scroll Container: Always uses horizontal flex/scroll */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory lg:h-[520px] lg:gap-6" 
        >
          {/* Radial Occupancy Card - FIXED WIDTH + LG ADJUSTMENT */}
          <Card className="flex flex-col relative flex-shrink-0 w-[320px] lg:w-[400px] snap-start border border-gray-200 hover:border-blue-500 h-[420px] lg:h-[520px]">
            
            <CardTitle className="relative z-10">Occupancy by Bed</CardTitle>
            
            <CardContent>
                <div className="flex flex-col items-center justify-center gap-4 h-full"> 
                    <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
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
                                    dataKey="value"
                                    paddingAngle={0}
                                >
                                    <Cell fill="#5B93FF" />
                                    <Cell fill="#D5F8FF" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-lg md:text-xl lg:text-xl font-extrabold text-black">
                                {occupancyCount.occupied}/{occupancyCount.total}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center pt-2 flex-1">
                        <div className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-black">
                            {occupancyPercent}%
                        </div>
                        <p className="text-base font-bold text-black mt-2">
                            {occupancyCount.occupied} of {occupancyCount.total} beds occupied
                        </p>
                        <div className="text-sm font-normal text-green-600 mt-1">
                            +5% since last month
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Category Donut Card - FIXED WIDTH + LG ADJUSTMENT */}
          <Card className="flex flex-col relative flex-shrink-0 w-[320px] lg:w-[400px] snap-start border border-gray-200 hover:border-blue-500 h-[420px] lg:h-[520px]">
            <CardHeader>
              <CardTitle className="relative z-10">Occupancy by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Enforce vertical stack (flex-col) and centering */}
              <div className="mt-2 flex flex-col items-center gap-6 h-full">
                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="90%"
                        dataKey="value"
                        paddingAngle={4}
                      >
                        {categoryData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend list is now centered and uses full card width (minus padding) */}
                <div className="flex-1 w-full max-w-[250px]">
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

          {/* Duration Bar Chart - FIXED WIDTH + LG ADJUSTMENT */}
          <Card className="flex flex-col relative flex-shrink-0 w-[320px] lg:w-[400px] snap-start border border-gray-200 hover:border-blue-500 h-[420px] lg:h-[520px]">
            <CardHeader>
              <CardTitle className="relative z-10">Occupancy Trend</CardTitle>
              <div className="flex gap-2 flex-wrap justify-end">
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
              <div className="w-full h-full"> 
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={durationOptions[duration]} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar
                      dataKey="value"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={12}
                      activeBar={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Forecast Card - FIXED WIDTH + LG ADJUSTMENT */}
          <Card className="flex flex-col relative flex-shrink-0 w-[320px] lg:w-[400px] snap-start border border-gray-200 hover:border-blue-500 h-[420px] lg:h-[520px]">
            <CardTitle className="relative z-10 mb-4">
              Occupancy Forecast
            </CardTitle>
            <CardContent>
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <p className="text-lg font-bold text-black">
                        Next month projected Occupancy:
                    </p>
                    <div className="text-5xl font-extrabold text-blue-600 mt-2">90%</div>
                    <p className="text-base font-medium text-gray-700 mt-4">
                        Projected 48 out of 53 beds booked.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Based on reservations and historical data.
                    </p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Table Card (Full Width) */}
      <Card className="h-auto lg:min-h-[320px]">
        <CardHeader>
          <CardTitle>Occupancy by Bed/Room</CardTitle>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
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
          <div className="overflow-x-auto shadow ring-1 ring-black/5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="text-white text-left px-4 py-3 text-sm font-medium whitespace-nowrap">Room ID</th>
                  <th className="text-white text-left px-4 py-3 text-sm font-medium whitespace-nowrap">Bed ID</th>
                  <th className="text-white text-left px-4 py-3 text-sm font-medium whitespace-nowrap">Status</th>
                  <th className="text-white text-left px-4 py-3 text-sm font-medium whitespace-nowrap">Guest Name</th>
                  <th className="text-white text-left px-4 py-3 text-sm font-medium whitespace-nowrap">Check-in Date</th>
                  <th className="text-white text-left px-4 py-3 text-sm font-medium whitespace-nowrap">Check-out Date</th>
                  <th className="text-white text-left px-4 py-3 text-sm font-medium whitespace-nowrap">Rent</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredBeds.map((bed, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{bed.room}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{bed.bed}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{bed.guest}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{bed.checkin}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{bed.checkout}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{bed.rent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBeds.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                    No {filter} beds found.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OccupancyPage;