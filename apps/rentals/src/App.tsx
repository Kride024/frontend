// // apps/rentals/src/App.tsx
// import React, { useState, useEffect } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";

// // ────── Constants ──────
// // In App.tsx — use clean aliases
// import { RENTALS_BASE, FOOTER_PATH } from "@/routes/constants";
// import ProtectedRoute from "@/routes/ProtectedRoute";


// // ────── Landing Page Components ──────
// import InitialLandingPage from "@/app/pages/landingpage/InitialLandingPage";
// import FooterPage from "./app/pages/landingpage/Footer/FooterPage"; 

// // ────── Common Components (keep for now) ──────
// //import NotfoundView from "@shared/ui/NotfoundView";
// // import UnauthorizeView from "@shared/ui/UnauthorizeView";
// // import AuthModal from "@shared/ui/AuthModalView";
// // import ChatBot from "@shared/ui/ChatBot";

// // ────── Protected Route (keep but simplified for testing) ──────

// const App: React.FC = () => {
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [intendedPath, setIntendedPath] = useState<string | null>(null);

//   // Load Razorpay (optional, keep for now)
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//     return () => document.body.removeChild(script);
//   }, []);

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setIntendedPath(null);
//     navigate("/");
//   };

//   const modalProps = { isModalOpen, setIsModalOpen, intendedPath, setIntendedPath };

//   return (
//     <>
//       <Routes>
//         {/* ────── ONLY LANDING PAGE ACTIVE ────── */}
//         <Route path="/" element={<InitialLandingPage {...modalProps} />} />
//         <Route path={`${FOOTER_PATH}/:section`} element={<FooterPage />} />

//         {/* ────── PG Landing (if you want to test) ────── */}
//         {/* <Route path={`${PG_BASE}/*`} element={<div>PG App (coming soon)</div>} /> */}

//         {/* ────── ALL OTHER ROUTES COMMENTED OUT FOR TESTING ────── */}
//         {/* 
//           User Routes, Admin, Studio, RM, FM, etc. 
//           → Uncomment one by one when ready 
//         */}
//         {/* <Route path={`${RENTALS_BASE}/*`} element={<UserLayout {...modalProps} />}> ... </Route> */}
//         {/* <Route path={`${STUDIO_BASE}/*`} element={<StudioUserLayout {...modalProps} />}> ... </Route> */}
//         {/* <Route path={ADMIN_BASE} element={<AdminLayout {...modalProps} />}> ... </Route> */}

//         {/* Fallback */}
//         {/* <Route path="/unauthorize" element={<UnauthorizeView />} />
//         <Route path="*" element={<NotfoundView />} /> */}
//       </Routes>

//       {/* Global Modals */}
//       {/* <AuthModal isOpen={isModalOpen} onClose={closeModal} triggerBy={intendedPath} />
//       <ChatBot /> */}
//     </>
//   );
// };

// export default App;



import React, { useState, useEffect, FC } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// Route Constants
import {
  ADMIN_BASE,
  RM_BASE,
  FM_BASE,
  RENTALS_BASE,
  STUDIO_BASE,
  PG_BASE,
  ENQUIRIES_PATH,
  FOOTER_PATH,
} from "@packages/config/constants";
import PGApp from "@pg";
// Components
import InitialLandingPage from "@/app/pages/landingpage/InitialLandingPage";
 import NotfoundView from "../../../packages/ui/Shared/NotFoundView";
 //import UnauthorizeView from "../../../packages/ui/Shared/UnauthorizedView";

// Layouts
import UserLayout from "../../../packages/ui/Layout/UserLayout";
 import AdminLayout from "../src/app/roles/admin/layout/AdminLayout";
// import StudioUserLayout from "./StudioView/layout/StudioUserLayout";
// import PGUserLayout from "./PG/Common/LandingPage/PGUserLayout";

// User Components
import PropertiesView from "./app/features/Properties/PropertiesView";
 import MyListingsView from "@/app/roles/user/MyListings/index";
 import PostPropertiesView from "@/app/features/PostProperties/index";
 import FavoritesView from "@/app/roles/user/MyFavorites/index";
 import ProfileView from "../../../packages/ui/ProfilePage/index";
// import UserTransactionsView from "./UserView/components/UserTransactions";
// import ServicesView from "./UserView/components/ServicesView";

// RM & FM Components
 import RMView from "@/app/roles/rm/RmView";
 import FMView from "@/app/roles/fm/FmView";

// Enquiries
import EnquiriesView from "@/app/shared/components/Enquiries/index";

// Admin Components
 import Dashboard from "@/app/roles/admin/components/DashboardView/index";
import { PropertyListings } from "@/app/roles/admin/components/PropertyListingsView/index";
 import Requests from "@/app/roles/admin/components/RequestsView/index";
 import StaffAssignment from "@/app/roles/admin/components/StaffAssignemntView/index";
 import Communities from "@/app/roles/admin/components/AddCommunityView/Communities";
 import UserManagement from "@/app/roles/admin/components/UserManagementView/index";
 import DBTables from "@/app/roles/admin/components/DBTables/index";
 import Reviews from "@/app/roles/admin/components/Reviews/index";
import AuthModal from "../../../packages/ui/AuthModal/AuthModal";

// Studio Components
// import StudioLandingView from "./StudioView/components/InitialLandingView";
// import StudioDashboard from "./StudioView/components/InitialLandingView/StudioDashboard";
// import ProjectStatus from "./StudioView/components/ProjectStatus";
// import PaymentsDocsPage from "./StudioView/components/StdDasshboard/ProjectCards/PaymentDocs";
// import AdminBoard from "./StudioView/adminboard/AdminBoard";
// import VendorApp from "./StudioView/StudioVendor/CommonViews/StudioVendorApp";
// import SiteManagerView from "./StudioView/StudioSiteManager/CommonViews/StdSMView";

// PG components
//import { PGLandingPage } from "./PG/Common/LandingPage/LandingPage";

// Protected Route
import ProtectedRoute from "@/routes/ProtectedRoute";

// Common Routes
import ChatBot from "../../../packages/ui/ChatBot/index";
import FooterPage from "./app/pages/landingpage/Footer/FooterPage";

//import "./App.css";

// ───────────────────────────────────────────
// TYPES
// ───────────────────────────────────────────
interface AppProps {}

const App: FC<AppProps> = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [intendedPath, setIntendedPath] = useState<string | null>(null);

  const onCloseModal = () => {
    setIsModalOpen(false);
    setIntendedPath(null);
    navigate("/");
  };

  // Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("App: Razorpay script loaded");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const passProps = {
    isModalOpen,
    setIsModalOpen,
    intendedPath,
    setIntendedPath,
  };

  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<InitialLandingPage {...passProps} />} />
        <Route path={`${FOOTER_PATH}/:section`} element={<FooterPage />} />

        {/* PG APP MOUNT */}
      <Route path={PG_BASE + "/*"} element={<PGApp />} />

        {/* ───── STUDIO ───── */}
        {/* <Route path={STUDIO_BASE} element={<StudioUserLayout {...passProps} />}>
          <Route index element={<StudioLandingView />} />
          <Route path="studioDashboard" element={<StudioDashboard />} />
          <Route path="taskStatus" element={<ProjectStatus />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="projectPaymentsDocs" element={<PaymentsDocsPage />} />
          <Route path="siteManager" element={<SiteManagerView />} />

          <Route element={<ProtectedRoute roles={["Vendor"]} {...passProps} />}>
            <Route path="vendor" element={<VendorApp />} />
          </Route>
        </Route> */}

        {/* ───── USER RENTALS ───── */}
        <Route path={RENTALS_BASE} element={<UserLayout {...passProps} />}>
          <Route index element={<PropertiesView />} />

           <Route
            element={
              <ProtectedRoute roles={["User", "Admin", "RM", "FM"]} {...passProps} />
            }
          >
             <Route path="mylistings" element={<MyListingsView />} /> 
            <Route path="postProperties" element={<PostPropertiesView />} />
             <Route path="myfavorites" element={<FavoritesView />} />
            <Route path="profile" element={<ProfileView />} />
           {/* <Route path="transactions" element={<UserTransactionsView />} />
            <Route path="myservices" element={<ServicesView />} /> */}
          </Route> 
        </Route>

        {/* ───── COMMON PROTECTED ROUTES ───── */}
         <Route element={<ProtectedRoute roles={["RM", "Admin"]} {...passProps} />}>
          <Route path={ENQUIRIES_PATH} element={<EnquiriesView />} />
        </Route> 

        {/* <Route element={<ProtectedRoute roles={["Admin"]} />}>
          <Route path="/base/studio/AdminBoard" element={<AdminBoard />} />
        </Route> */}

        {/* ───── RM ROUTES ───── */}
         <Route element={<ProtectedRoute roles={["RM"]} {...passProps} />}>
          <Route path={RM_BASE} element={<RMView />} />
        </Route> 

        {/* ───── FM ROUTES ───── */}
        <Route element={<ProtectedRoute roles={["FM"]} {...passProps} />}>
          <Route path={FM_BASE} element={<FMView />} />
        </Route>

        {/* ───── ADMIN ROUTES ───── */}
        <Route element={<ProtectedRoute roles={["Admin"]} {...passProps} />}>
          <Route path={ADMIN_BASE} element={<AdminLayout {...passProps} />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<PropertyListings />} />
            <Route path="requests" element={<Requests />} />
            <Route path="testimonials" element={<Reviews />} />
            <Route path="assign-managers" element={<StaffAssignment />} />
            <Route path="communities" element={<Communities />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="db-tables" element={<DBTables />} />
            <Route path="reports" element={<div>Reports View</div>} />
            <Route path="profile" element={<ProfileView />} /> 
          </Route>
        </Route>

        {/* ───── FALLBACK ROUTES ───── */}
        {/* <Route path="/unauthorize" element={<UnauthorizeView />} /> */}
        <Route path="*" element={<NotfoundView />} />
      </Routes>

      <AuthModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        triggerBy={intendedPath}
      />
       <ChatBot /> 
    </>
  );
};

export default App;
