import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar1 from "@pg/app/shared/components/Calender";
import First from "@pg/app/roles/manager/actionCard/ManOverviewCards";
import ActionButtons from "@pg/app/roles/manager/actionCard/ManActionCard";
import MaintenanceAlertsDashboard from "@pg/app/shared/components/Mantainence";
import RecentActivityFeed from "@pg/app/shared/components/RecentActivity";
import Upcoming from "@pg/app/shared/components/Upcoming";
import CriticalAlerts from "@pg/app/shared/components/criticalAlerts";
import { useAuth } from "@pg/app/shared/hooks/context/AuthContext";

export default function MDashboardManager() {
  const navigate = useNavigate();

  // UI modal states
  const [isAddManagerOpen, setIsAddManagerOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [isSendOpen, setIsSendOpen] = useState<boolean>(false);
  const [announcementSuccess, setAnnouncementSuccess] = useState<boolean>(false);
  const [isAddNewPGOpen, setIsAddNewPGOpen] = useState<boolean>(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState<boolean>(false);

  // Auth context
  const { user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isAddManagerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAddManagerOpen]);

  return (
    <main className="min-h-screen bg-[#E7EFF7] p-6 lg:p-10">
      {/* Pass the logged-in user's name */}
      <First name={user?.name || ""} />

      {/* Action Buttons */}
      <ActionButtons />

      {/* Tables and Dashboard Components */}
      <div className="mt-14">
        <Upcoming />
      </div>

      <div className="mt-14">
        <CriticalAlerts />
      </div>

      <div className="mt-6 sm:mt-10">
        <MaintenanceAlertsDashboard />
      </div>

      <div className="mt-6 sm:mt-10">
        <Calendar1 />
      </div>

      <div className="mt-6 sm:mt-10">
        <RecentActivityFeed />
      </div>
    </main>
  );
}
