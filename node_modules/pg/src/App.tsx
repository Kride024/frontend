import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminLayout from "@pg/app/roles/admin/Layout/AdminLayout";
// --- Layouts and Guards ---
import { DashboardLayout } from "../../../packages/ui/Layout/DashboardLayout";
import { RoleProtectedRoute } from "@pg/app/shared/hooks/context/RoleProtectedRoute";

// --- Public Page ---
import { Landingpage } from "@pg/app/pages/landingPage/LandingPage";

// --- Dashboard Pages ---
// Make sure you have fixed the naming in these files
import { AdminDashboard } from "@pg/app/roles/admin/Dashboard/AdminDashboard";
import GuestDashboard from "@pg/app/roles/user/dashboard/GuestDashboard";
import ManDashboard from "@pg/app/roles/manager/dashboard/ManDashboard";
import OwnDashboard from "@pg/app/roles/owner/dashboard/OwnerDashboard";

// --- Owner's Child Pages (from your file list) ---
import Occupancy from "@pg/app/shared/components/Occupancy";
import GuestInsights from "@pg/app/shared/components/GuestInsights";
import PendingDues from "@pg/app/shared/components/Pending";
import Profitibility from "@pg/app/shared/components/Profitibility";

// 1. IMPORT THE NEW MODAL
import { AuthModal } from "@pg/app/shared/hooks/context/AuthModal";

// A simple "Unauthorized" page component
const Unauthorized = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="mt-2">You do not have permission to view this page.</p>
    </div>
  </div>
);



export default function App() {
  return (
    <>
      <Routes>

        {/* Public */}
        <Route index element={<Landingpage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Owner */}
        <Route element={<RoleProtectedRoute allowedRoles={['owner', 'admin']} />}>
          <Route path="owner" element={<DashboardLayout />}>
            <Route path="dashboard" element={<OwnDashboard />} />
            <Route path="pending-dues" element={<PendingDues />} />
            <Route path="profitibility" element={<Profitibility />} />
            <Route path="occupancy" element={<Occupancy />} />
            <Route path="guest-insights" element={<GuestInsights />} />
          </Route>
        </Route>

        {/* Guest */}
        <Route element={<RoleProtectedRoute allowedRoles={['guest', 'admin']} />}>
          <Route path="guest" element={<DashboardLayout />}>
            <Route path="dashboard" element={<GuestDashboard />} />
          </Route>
        </Route>

        {/* Manager */}
        <Route element={<RoleProtectedRoute allowedRoles={['manager', 'admin']} />}>
          <Route path="manager" element={<DashboardLayout />}>
            <Route path="dashboard" element={<ManDashboard />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

      </Routes>

      <AuthModal />
    </>
  );
}
