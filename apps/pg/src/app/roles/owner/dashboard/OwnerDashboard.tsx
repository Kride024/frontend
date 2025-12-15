// src/pages/ODashboardOwner.tsx or src/components/ODashboardOwner.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Calendar1 from "@pg/app/shared/components/Calender";
import First from "../actionCard/OwnOverviewCards";
import MaintenanceAlertsDashboard from "@pg/app/shared/components/Mantainence";
import ActionButtons from "../actionCard/OwnActionCard";
import RecentActivityFeed from "@pg/app/shared/components/RecentActivity";
import Upcoming from "@pg/app/shared/components/Upcoming";
import CriticalAlerts from "@pg/app/shared/components/criticalAlerts";

// Auth Context
import { useAuth } from "@pg/app/shared/hooks/context/AuthContext";

// Types
interface User {
  name?: string;
  email?: string;
  role?: string;
  // Add other fields as needed
}

export default function OwnerDashboard() {
  const navigate = useNavigate();

  // Modal states
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);
  const [isAddNewPGOpen, setIsAddNewPGOpen] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);

  // Get user from auth context
  const auth = useAuth() as { user?: User | null } | null;
  const user = auth?.user ?? null;

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (isAddManagerOpen || isSendOpen || isAddNewPGOpen || isAddGuestOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAddManagerOpen, isSendOpen, isAddNewPGOpen, isAddGuestOpen]);

  // Optional: Show success toast and auto-hide
  useEffect(() => {
    if (announcementSuccess) {
      const timer = setTimeout(() => {
        setAnnouncementSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [announcementSuccess]);

  return (
    <main className="min-h-screen bg-[#E7EFF7] p-6 lg:p-10">
      {/* Hero Section - Owner Greeting + Cards */}
      <First />

      {/* Action Buttons Row */}
      <div className="mt-10">
        <ActionButtons
          onAddManager={() => setIsAddManagerOpen(true)}
          onSendAnnouncement={() => setIsSendOpen(true)}
          onDownloadReport={() => setIsDownloadOpen(true)}
          onAddPG={() => setIsAddNewPGOpen(true)}
          onAddGuest={() => setIsAddGuestOpen(true)}
        />
      </div>

      {/* Dashboard Sections */}
      <section className="mt-14 space-y-10">
        {/* Upcoming Events / Payments */}
        <Upcoming />

        {/* Critical Alerts */}
        <CriticalAlerts />

        {/* Maintenance Alerts */}
        <MaintenanceAlertsDashboard />

        {/* Calendar */}
        <div className="mt-10">
          <Calendar1 />
        </div>

        {/* Recent Activity Feed */}
        <RecentActivityFeed />
      </section>

      {/* Optional: Success Toast for Announcement */}
      {announcementSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Announcement sent successfully!</span>
          </div>
        </div>
      )}
    </main>
  );
}