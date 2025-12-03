/**
 * @file Centralized data definitions for the Guest Insights dashboard.
 * Converted to TypeScript for better maintainability, type safety, and IntelliSense.
 */

// =======================
// 📍 Type Definitions
// =======================

export interface Metric {
  id: string;
  value: number;
  label: string;
  sub: string;
  displayValue?: string;
  max?: number;
}

export interface Feedback {
  id: number;
  guest: string;
  issue: string;
  date: string;
  timeAgo: string;
  status: string;
  color: string;
}

export interface TrendScore {
  month: string;
  score: number;
}

export interface SegmentationData {
  name: string;
  value: number;
  color: string;
}

export interface DemographicItem {
  label: string;
  pct: number;
  color: string;
}

export interface GuestLifecycle {
  id: string;
  name: string;
  room: {
    number: number;
    bed: string;
  };
  checkIn: string;
  checkOut: string;
  paymentStatus: string;
  payColor: string;
  contractStatus: string;
  engagementScore: number;
}

export interface PredictiveInsight {
  renewalProbability: number;
  churnTrend: { month: string; value: number }[];
}

// =======================
// 📊 Typed Data Constants
// =======================

export const METRICS_DATA: Metric[] = [
  { id: "metric-1", value: 44, label: "Total Guests", sub: "(Active)" },
  { id: "metric-2", value: 7, label: "New Guests", sub: "This month" },
  { id: "metric-3", value: 5, label: "Expiring leases", sub: "In 30 days" },
  { id: "metric-4", value: 4.8, label: "Average Guest Tenure", sub: "months" },
  { id: "metric-5", value: 0.12, displayValue: "12%", label: "Repeat Guests", sub: "" },
  { id: "metric-6", value: 4.3, max: 5, displayValue: "4.3/5", label: "Guest Satisfaction Score", sub: "" },
];

export const FEEDBACK_DATA: Feedback[] = [
  { id: 1, guest: "Rahul Mehta 201 - B", issue: "Food quality poor", date: "2025-10-08", timeAgo: "5 days ago", status: "Escalated", color: "bg-red-100 text-red-600" },
  { id: 2, guest: "Ria Shetty 202 - A", issue: "WiFi slow speed", date: "2025-10-12", timeAgo: "1 day ago", status: "Open", color: "bg-yellow-100 text-yellow-700" },
  { id: 3, guest: "Priya Singh 204 - A", issue: "Maintenance broken chair", date: "2025-09-29", timeAgo: "2 weeks ago", status: "Resolved", color: "bg-green-100 text-green-600" },
  { id: 4, guest: "Lara Sharma 103 - C", issue: "Maintenance leak in bathroom", date: "2025-10-06", timeAgo: "1 week ago", status: "Resolved", color: "bg-green-100 text-green-600" },
];

export const FEEDBACK_TREND_DATA: TrendScore[] = [
  { month: "Apr", score: 3.5 },
  { month: "May", score: 4.0 },
  { month: "Jun", score: 4.2 },
  { month: "Jul", score: 3.9 },
  { month: "Aug", score: 4.3 },
  { month: "Sep", score: 4.1 },
  { month: "Oct", score: 4.7 },
];

export const STAY_SEGMENTATION_DATA: SegmentationData[] = [
  { name: "Mid-Term (3–6 months)", value: 52, color: "#4F80FF" },
  { name: "Short-Term (<3 months)", value: 28, color: "#FFA053" },
  { name: "Long-Term (>6 months)", value: 20, color: "#F7D25A" },
];

export const REVENUE_SEGMENTATION_DATA: SegmentationData[] = [
  { name: "Students", value: 68, color: "#4F80FF" },
  { name: "Working Professionals", value: 32, color: "#F7D25A" },
];

export const DEMOGRAPHICS_DATA: {
  age: DemographicItem[];
  gender: DemographicItem[];
  occupation: DemographicItem[];
  city: DemographicItem[];
} = {
  age: [
    { label: "18–25", pct: 12, color: "bg-blue-500" },
    { label: "25–30", pct: 57, color: "bg-teal-400" },
    { label: "30+", pct: 31, color: "bg-pink-500" },
  ],
  gender: [
    { label: "Female", pct: 20, color: "bg-blue-400" },
    { label: "Male", pct: 77, color: "bg-green-500" },
    { label: "Other", pct: 3, color: "bg-emerald-300" },
  ],
  occupation: [
    { label: "Students", pct: 64, color: "bg-amber-400" },
    { label: "IT professionals", pct: 36, color: "bg-rose-400" },
  ],
  city: [
    { label: "Hyderabad", pct: 28, color: "bg-rose-400" },
    { label: "Warangal", pct: 18, color: "bg-teal-400" },
    { label: "Others", pct: 54, color: "bg-emerald-400" },
  ],
};

export const GUEST_LIFECYCLE_DATA: GuestLifecycle[] = [
  { id: "guest-1", name: "Rahul Mehta", room: { number: 201, bed: "B" }, checkIn: "2025-01-01", checkOut: "2025-01-30", paymentStatus: "On-time", payColor: "bg-green-500", contractStatus: "", engagementScore: 83 },
  { id: "guest-2", name: "Anjali Kumar", room: { number: 102, bed: "A" }, checkIn: "2025-02-15", checkOut: "2025-04-14", paymentStatus: "Delayed", payColor: "bg-red-500", contractStatus: "Renew", engagementScore: 76 },
  { id: "guest-3", name: "Vikram Patel", room: { number: 304, bed: "B" }, checkIn: "2025-03-05", checkOut: "2025-08-31", paymentStatus: "Pending", payColor: "bg-red-500", contractStatus: "Expiring soon", engagementScore: 91 },
  { id: "guest-4", name: "Roma Das", room: { number: 208, bed: "B" }, checkIn: "2025-06-20", checkOut: "2025-10-19", paymentStatus: "On-time", payColor: "bg-green-500", contractStatus: "Active", engagementScore: 62 },
  { id: "guest-5", name: "Dia Sharma", room: { number: 203, bed: "A" }, checkIn: "2025-06-20", checkOut: "2025-08-13", paymentStatus: "On-time", payColor: "bg-green-500", contractStatus: "Active", engagementScore: 78 },
];

export const PREDICTIVE_INSIGHTS_DATA: PredictiveInsight = {
  renewalProbability: 72,
  churnTrend: [
    { month: "Apr", value: 0.28 },
    { month: "May", value: 0.32 },
    { month: "Jun", value: 0.30 },
    { month: "Jul", value: 0.34 },
    { month: "Aug", value: 0.31 },
    { month: "Sep", value: 0.33 },
    { month: "Oct", value: 0.36 },
  ],
};
