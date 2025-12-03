


import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useRoleStore } from "../../../../../../../packages/store/roleStore";
import useUserListingsStore from "../../../store/userListingsStore";
import useActionsListingsStore from "../../../store/actionsListingsStore";
import tailwindStyles from "../../../../../../../packages/styles/tailwindStyles";
import AuthModal from "../../../../../../../packages/ui/AuthModal/AuthModal";
import SyncNotification from "./SyncNotification";
import ProfileDropdown from "./ProfileDropdown";
import MenuDropdown from "./MenuDropdown";

import {
  RENTALS_BASE,
  ADMIN_BASE,
  RM_BASE,
  FM_BASE,
  ENQUIRIES_PATH,
} from "@packages/config/constants";

const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

// -------------------- TYPES --------------------

interface NavbarProps {
  intendedPath?: string | null;
  setIntendedPath: (path: string | null) => void;
}

interface UserItem {
  path: string;
  label: string;
}

interface ApiResponse {
  data?: any[];
}

interface UserRoleData {
  role?: "rm" | "fm" | "admin" | "user" | string;
}

// ------------------------------------------------

const Navbar: React.FC<NavbarProps> = ({ intendedPath, setIntendedPath }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  // Stores
  const { userData }: { userData: UserRoleData } = useRoleStore();
  const { role } = userData || {};

  const { apiResponse }: { apiResponse: ApiResponse } = useUserListingsStore();
  const { userProperties }: { userProperties: any[] } = useActionsListingsStore();

  const jwtToken = Cookies.get(jwtSecretKey);
  const isLogin = !!jwtToken;

  // State
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [navItems, setNavItems] = useState<UserItem[]>([]);

  const mylistingsCount = apiResponse?.data?.length || 0;
  
  const favoritesCount = userProperties?.length || 0;

  // ------------------------------------------------

  useEffect(() => {
    const updatedItems: UserItem[] = [];
   
    if (mylistingsCount > 0) {
      updatedItems.push({ path: "mylistings", label: "My Listings" });
    }
   
    if (favoritesCount > 0) {
      updatedItems.push({ path: "myfavorites", label: "My Favorites" });
    }

    setNavItems(updatedItems);
  }, [mylistingsCount, favoritesCount, intendedPath, setIntendedPath, location.pathname]);

  // ------------------------------------------------

  const openModal = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIntendedPath(null);
  };

  const handleLinkClick = (path: string) => {
    const fullPath = `${RENTALS_BASE}/${path}`;

    if (!isLogin) {
      setIntendedPath(fullPath);
      openModal();

      if (location.pathname !== "/") {
        navigate("/");
      }
    } else {
      navigate(fullPath);
    }
  };

  const onClickMain = () => {
    navigate("/");
  };

  // ------------------------------------------------

  return (
    <>
      <header
        className={`${tailwindStyles.header} md:${
          location.pathname !== "/"
            ? "w-full sticky top-0 left-0"
            : "w-[calc(100vw-100px)] mx-auto"
        } w-full p-3 px-5 md:px-10 flex flex-col justify-between items-center shadow-md z-30 relative`}
      >
        <div className="w-full flex justify-between items-center">
          <button onClick={onClickMain}>
            <img src="/RUFRENT6.png" alt="logo" className={tailwindStyles.logo} />
            <div className="justify-self-start">
              <span className="text-xs md:text-sm lg:text-md pl-1 tracking-widest text-white">
                Rentals
              </span>
            </div>
          </button>

          {/* Mobile */}
          <div className="flex items-center space-x-6 lg:hidden z-30">
            {isLogin ? (
              <ProfileDropdown toggleMenu={() => setIsMenuOpen(false)} />
            ) : (
              <button onClick={openModal} className={tailwindStyles.header_item}>
                Login
              </button>
            )}
            <button className="text-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              ☰
            </button>
          </div>

          {/* Desktop */}
          <nav className="hidden lg:flex space-x-6 items-center justify-center">
            {/* Post Property */}
            <div
              onClick={() => handleLinkClick("postProperties")}
              className="flex justify-center items-center w-40 h-7 bg-white rounded-md cursor-pointer"
            >
              <div className="font-semibold text-sm pb-0.5 text-gray-800 mr-2">
                Post Property
              </div>
              <div className="bg-green-700 text-white font-bold text-xs px-2 rounded-sm relative inline-block">
                FREE
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-300 transform skew-x-12 animate-pulse"></div>
              </div>
            </div>

            {/* Dashboards */}
            {isLogin && role === "rm" && (
              <NavLink to={RM_BASE} className={tailwindStyles.header_item}>
                RM Dashboard
              </NavLink>
            )}
            {isLogin && role === "fm" && (
              <NavLink to={FM_BASE} className={tailwindStyles.header_item}>
                FM Dashboard
              </NavLink>
            )}
            {isLogin && role === "admin" && (
              <NavLink to={ADMIN_BASE} className={tailwindStyles.header_item}>
                Admin Dashboard
              </NavLink>
            )}

            {/* Enquiries */}
            {isLogin && (role === "admin" || role === "rm") && (
              <NavLink
                to={ENQUIRIES_PATH}
                className={`${tailwindStyles.header_item} ${
                  activePath === ENQUIRIES_PATH ? tailwindStyles.activeTab : ""
                }`}
              >
                Enquiries
              </NavLink>
            )}

            {/* User's MyListings & Favorites */}
            {isLogin &&
              navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`${tailwindStyles.header_item} ${
                    activePath === `${RENTALS_BASE}/${item.path}`
                      ? tailwindStyles.activeTab
                      : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}

            {/* Notifications & Profile */}
            {isLogin && <SyncNotification />}
            {isLogin ? (
              <ProfileDropdown />
            ) : (
              <button
                onClick={openModal}
                className={`${tailwindStyles.header_item} hover:underline underline-offset-4`}
              >
                Login
              </button>
            )}

            <MenuDropdown />
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#001433] shadow-lg z-30">
            <div className="flex flex-col items-center py-6">
              {/* Role dashboards */}
              {role === "rm" && (
                <NavLink to={RM_BASE} className={tailwindStyles.header_item}>
                  RM Dashboard
                </NavLink>
              )}
              {role === "fm" && (
                <NavLink to={FM_BASE} className={tailwindStyles.header_item}>
                  FM Dashboard
                </NavLink>
              )}
              {role === "admin" && (
                <NavLink to={ADMIN_BASE} className={tailwindStyles.header_item}>
                  Admin Dashboard
                </NavLink>
              )}

              {isLogin && (role === "rm" || role === "admin") && (
                <NavLink
                  to={ENQUIRIES_PATH}
                  className={`${tailwindStyles.header_item} ${
                    activePath === ENQUIRIES_PATH ? tailwindStyles.activeTab : ""
                  }`}
                >
                  Enquiries
                </NavLink>
              )}

              {/* Post property mobile */}
              <div
                onClick={() => handleLinkClick("postProperties")}
                className="flex justify-center items-center w-40 h-7 my-4 bg-white rounded-md cursor-pointer"
              >
                <div className="font-semibold text-sm pb-0.5 text-gray-800 mr-2">
                  Post Property
                </div>
                <div className="bg-green-700 text-white font-bold text-xs px-2 rounded-sm relative inline-block">
                  FREE
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-300 transform skew-x-12 animate-pulse"></div>
                </div>
              </div>

              {/* User items */}
              {isLogin &&
                navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleLinkClick(item.path)}
                    className={`${tailwindStyles.header_item} mb-4 ${
                      activePath === `${RENTALS_BASE}/${item.path}`
                        ? tailwindStyles.activeTab
                        : ""
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

              {isLogin && (
                <div className="mb-4">
                  <SyncNotification />
                </div>
              )}

              {!isLogin && (
                <button onClick={openModal} className={`${tailwindStyles.header_item} mb-4`}>
                  Login
                </button>
              )}

              <MenuDropdown onCloseMobileMenu={() => setIsMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isModalOpen} onClose={closeModal} triggerBy={intendedPath || undefined} />
    </>
  );
};

Navbar.propTypes = {
  intendedPath: PropTypes.string,
  setIntendedPath: PropTypes.func.isRequired,
};

export default Navbar;


// import React, { useState, useEffect } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { FC } from "react";
// import tailwindStyles from "@packages/styles/tailwindStyles";
// import { useAuthModal } from "@pg/app/shared/hooks/context/AuthContext";
// import AuthModal from "../../../../../../../packages/ui/AuthModal/AuthModal";
// import SyncNotification from "./SyncNotification";
// import ProfileDropdown from "./ProfileDropdown";
// import MenuDropdown from "./MenuDropdown";
// import {
//   RENTALS_BASE,
//   ADMIN_BASE,
//   RM_BASE,
//   FM_BASE,
//   ENQUIRIES_PATH,
// } from "@packages/config/constants";
// import { useRoleStore } from "../../../../../../../packages/store/roleStore";
// import useUserListingsStore from "../../../store/userListingsStore";
// import useActionsListingsStore from "../../../store/actionsListingsStore";

// const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

// interface NavbarProps {
//   variant?: "landing" | "app"; // Controls which version to render
//   intendedPath?: string | null;
//   setIntendedPath?: (path: string | null) => void;
// }

// // Auto-detect if not provided
// const Navbar: FC<NavbarProps> = ({ 
//   variant: forcedVariant, 
//   intendedPath: propIntendedPath, 
//   setIntendedPath: propSetIntendedPath 
// }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { openModal: openLandingModal } = useAuthModal(); // For landing page

//   // Detect variant automatically if not forced
//   const isRentalsApp = location.pathname.startsWith("/");

// const variant = forcedVariant || (isRentalsApp ? "app" : "landing");

//   // App-specific logic (only run in app mode)
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [navItems, setNavItems] = useState<{ path: string; label: string }[]>([]);

//   const { userData } = useRoleStore();
//   const { role } = userData || {};
//   const { apiResponse } = useUserListingsStore();
//   const { userProperties } = useActionsListingsStore();
//   const jwtToken = Cookies.get(jwtSecretKey);
//   const isLogin = !!jwtToken;

//   const mylistingsCount = apiResponse?.data?.length || 0;
//   const favoritesCount = userProperties?.length || 0;

//   // Only compute dynamic nav items in app mode
//   useEffect(() => {
//     if (variant !== "app") return;

//     const items: { path: string; label: string }[] = [];
//     if (mylistingsCount > 0) items.push({ path: "mylistings", label: "My Listings" });
//     if (favoritesCount > 0) items.push({ path: "myfavorites", label: "My Favorites" });
//     setNavItems(items);
//   }, [mylistingsCount, favoritesCount, variant]);

//   // App auth handlers
//   const openModal = () => {
//     setIsModalOpen(true);
//     setIsMenuOpen(false);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     propSetIntendedPath?.(null);
//   };

//   const handleLinkClick = (path: string) => {
//     const fullPath = `${RENTALS_BASE}/${path}`;
//     if (!isLogin) {
//       propSetIntendedPath?.(fullPath);
//       openModal();
//       if (location.pathname !== "/") navigate("/");
//     } else {
//       navigate(fullPath);
//     }
//     setIsMenuOpen(false);
//   };

//   const onClickLogo = () => {
//     navigate("/");
//   };

//   // ------------------ RENDER LANDING NAVBAR ------------------
//   if (variant === "landing") {
//     return (
//       <nav className="sticky top-0 z-50 bg-[#181C3A] flex items-center justify-between px-12 py-2 shadow-2xl mx-0 sm:mx-[50px] overflow-auto">
//         {/* Logo + Title */}
//         <div className="flex flex-col items-start">
//           <div className="flex items-center space-x-2">
//             <img src="/RUFRENT6.png" alt="logo" className={tailwindStyles.logo} />
//           </div>
//           <div className="justify-self-start">
//             <span className="text-xs md:text-sm lg:text-md pl-1 tracking-widest text-white">
//               PG
//             </span>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-center space-x-6">
//           <button
//             onClick={openLandingModal}
//             className="text-white text-lg font-semibold hover:opacity-80 transition"
//           >
//             Login
//           </button>
//           <button className="bg-gradient-to-r from-[#FB432C] to-[#FF591E] text-white font-semibold text-lg px-6 py-2 rounded-xl shadow-md hover:opacity-90 transition">
//             Request Demo
//           </button>
//         </div>
//       </nav>
//     );
//   }

//   // ------------------ RENDER APP NAVBAR ------------------
//   return (
//     <>
//       <header
//         className={`${tailwindStyles.header} md:${
//           location.pathname !== "/" ? "w-full sticky top-0 left-0" : "w-[calc(100vw-100px)] mx-auto"
//         } w-full p-3 px-5 md:px-10 flex flex-col justify-between items-center shadow-md z-30 relative`}
//       >
//         <div className="w-full flex justify-between items-center">
//           {/* Logo */}
//           <button onClick={onClickLogo} className="flex items-center">
//             <img src="/RUFRENT6.png" alt="logo" className={tailwindStyles.logo} />
//             <div className="justify-self-start">
//               <span className="text-xs md:text-sm lg:text-md pl-1 tracking-widest text-white">
//                 Rentals
//               </span>
//             </div>
//           </button>

//           {/* Mobile Controls */}
//           <div className="flex items-center space-x-6 lg:hidden z-30">
//             {isLogin ? <ProfileDropdown /> : <button onClick={openModal} className={tailwindStyles.header_item}>Login</button>}
//             <button className="text-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>Menu</button>
//           </div>

//           {/* Desktop Nav */}
//           <nav className="hidden lg:flex space-x-6 items-center">
//             {/* Post Property */}
//             <div
//               onClick={() => handleLinkClick("postProperties")}
//               className="flex justify-center items-center w-40 h-7 bg-white rounded-md cursor-pointer"
//             >
//               <div className="font-semibold text-sm pb-0.5 text-gray-800 mr-2">Post Property</div>
//               <div className="bg-green-700 text-white font-bold text-xs px-2 rounded-sm relative inline-block">
//                 FREE
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-300 transform skew-x-12 animate-pulse"></div>
//               </div>
//             </div>

//             {/* Role Dashboards */}
//             {isLogin && role === "rm" && <NavLink to={RM_BASE} className={tailwindStyles.header_item}>RM Dashboard</NavLink>}
//             {isLogin && role === "fm" && <NavLink to={FM_BASE} className={tailwindStyles.header_item}>FM Dashboard</NavLink>}
//             {isLogin && role === "admin" && <NavLink to={ADMIN_BASE} className={tailwindStyles.header_item}>Admin Dashboard</NavLink>}

//             {/* Enquiries */}
//             {isLogin && (role === "admin" || role === "rm") && (
//               <NavLink to={ENQUIRIES_PATH} className={`${tailwindStyles.header_item} ${location.pathname === ENQUIRIES_PATH ? tailwindStyles.activeTab : ""}`}>
//                 Enquiries
//               </NavLink>
//             )}

//             {/* Dynamic User Links */}
//             {isLogin && navItems.map((item) => (
//               <button
//                 key={item.path}
//                 onClick={() => handleLinkClick(item.path)}
//                 className={`${tailwindStyles.header_item} ${location.pathname === `${RENTALS_BASE}/${item.path}` ? tailwindStyles.activeTab : ""}`}
//               >
//                 {item.label}
//               </button>
//             ))}

//             {isLogin && <SyncNotification />}
//             {isLogin ? <ProfileDropdown /> : <button onClick={openModal} className={tailwindStyles.header_item}>Login</button>}
//             <MenuDropdown />
//           </nav>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="lg:hidden absolute top-full left-0 w-full bg-[#001433] shadow-lg z-30">
//             <div className="flex flex-col items-center py-6 space-y-4">
//               {role === "rm" && <NavLink to={RM_BASE} className={tailwindStyles.header_item}>RM Dashboard</NavLink>}
//               {role === "fm" && <NavLink to={FM_BASE} className={tailwindStyles.header_item}>FM Dashboard</NavLink>}
//               {role === "admin" && <NavLink to={ADMIN_BASE} className={tailwindStyles.header_item}>Admin Dashboard</NavLink>}

//               {isLogin && (role === "rm" || role === "admin") && (
//                 <NavLink to={ENQUIRIES_PATH} className={tailwindStyles.header_item}>Enquiries</NavLink>
//               )}

//               <div
//                 onClick={() => handleLinkClick("postProperties")}
//                 className="flex justify-center items-center w-40 h-7 bg-white rounded-md cursor-pointer"
//               >
//                 <div className="font-semibold text-sm pb-0.5 text-gray-800 mr-2">Post Property</div>
//                 <div className="bg-green-700 text-white font-bold text-xs px-2 rounded-sm">FREE</div>
//               </div>

//               {isLogin && navItems.map((item) => (
//                 <button key={item.path} onClick={() => handleLinkClick(item.path)} className={tailwindStyles.header_item}>
//                   {item.label}
//                 </button>
//               ))}

//               {isLogin && <SyncNotification />}
//               {!isLogin && <button onClick={openModal} className={tailwindStyles.header_item}>Login</button>}
//               <MenuDropdown onCloseMobileMenu={() => setIsMenuOpen(false)} />
//             </div>
//           </div>
//         )}
//       </header>

//       {/* App Auth Modal */}
//       <AuthModal isOpen={isModalOpen} onClose={closeModal} triggerBy={propIntendedPath || undefined} />
//     </>
//   );
// };

// export default Navbar;