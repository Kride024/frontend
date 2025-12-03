// src/Common/Navbar.tsx (used only for Admin panel)
import React, { useState, useEffect } from "react";
import {
  BarChart2,
  Clock,
  TrendingUp,
  Wrench,
  MessageSquare,
  Receipt,
  Ticket,
  CalendarDays,
  Wallet,
  LogOut,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@pg/app/shared/hooks/context/AuthContext";
import tailwindStyles from "@packages/styles/tailwindStyles";
import { PG_BASE } from "@packages/config/constants";
interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RoleMenuChild {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface RoleMenu {
  key: string;
  label: string;
  color: string;
  dashboardTo: string;
  children: RoleMenuChild[];
}

export default function Navbar({ isOpen, setIsOpen }: NavbarProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Track screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---- ROLES & THEIR LINKS ----
  const roleMenus: RoleMenu[] = [
    {
      key: "owner",
      label: "Owner",
      color: "text-yellow-400",
      dashboardTo: `${PG_BASE}/owner/occupancy`,
      children: [
        { to:  `${PG_BASE}/owner/occupancy`, label: "Occupancy", icon: BarChart2 },
        { to:  `${PG_BASE}/owner/profitibility`, label: "Profitibility", icon: TrendingUp },
        { to:  `${PG_BASE}/owner/pending-dues`, label: "Pending Dues", icon: Clock },
        { to:  `${PG_BASE}/owner/service-req`, label: "Service Req", icon: Wrench },
        { to:  `${PG_BASE}/owner/feedback`, label: "Feedback", icon: MessageSquare },
      ],
    },
    {
      key: "manager",
      label: "Manager",
      color: "text-green-400",
      dashboardTo:  `${PG_BASE}/manager/dashboard`,
      children: [
        { to: `${PG_BASE}/manager/occupancy`, label: "Occupancy", icon: BarChart2 },
        { to: `${PG_BASE}/manager/pending-dues`, label: "Pending Dues", icon: Clock },
        { to: `${PG_BASE}/manager/service-req`, label: "Service Req", icon: Wrench },
        { to: `${PG_BASE}/manager/vendor-staff-queries`, label: "Vender/Staff Queries", icon: MessageSquare },
      ],
    },
    {
      key: "guest",
      label: "Guest",
      color: "text-amber-400",
      dashboardTo: `${PG_BASE}/guest/dashboard`,
      children: [
        { to: `${PG_BASE}/guest/dashboard`, label: "Service Req", icon: Wrench },
        { to: `${PG_BASE}/guest/dashboard`, label: "Feedback", icon: MessageSquare },
        { to: `${PG_BASE}/guest/dashboard`, label: "Due", icon: Receipt },
      ],
    },
    {
      key: "staff",
      label: "Staff",
      color: "text-sky-400",
      dashboardTo: `${PG_BASE}/staff/my-tickets`,
      children: [
        { to: `${PG_BASE}/staff/my-tickets`, label: "My Tickets", icon: Ticket },
        { to: `${PG_BASE}/staff/my-attendance`, label: "My Attendance", icon: CalendarDays },
      ],
    },
    {
      key: "vendor",
      label: "Vendor",
      color: "text-blue-400",
      dashboardTo: `${PG_BASE}/vendor/my-tickets`,
      children: [
        { to: `${PG_BASE}/vendor/my-tickets`, label: "My Tickets", icon: Ticket },
        { to: `${PG_BASE}/vendor/my-payment-req`, label: "My Payment Req", icon: Wallet },
      ],
    },
  ];

  // Helper: check if any submenu is active
  const isGroupActive = (children: RoleMenuChild[] = []) =>
    children.some((c) => location.pathname === c.to);

  // Navigate to role dashboard
  const handleRoleNavigate = (dashboardTo: string) => {
    if (dashboardTo) navigate(dashboardTo);
  };

  /* ------------------------ Mobile Top Bar ------------------------ */
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 bg-[#001433] shadow-sm z-50">
       
         <button onClick={() => navigate(`${PG_BASE}`)}>
            <img src="/RUFRENT6.png" alt="logo" className={tailwindStyles.logo} />
            <div className="justify-self-start">
              <span className="text-xs md:text-sm lg:text-md pl-1 tracking-widest text-white">
                PG
              </span>
            </div>
          </button>
        <div className="flex items-center gap-3">
          <button
            className="w-7 h-7 flex flex-col justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="block w-full h-[2px] bg-white"></span>
            <span className="block w-full h-[2px] bg-white"></span>
            <span className="block w-full h-[2px] bg-white"></span>
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------ Desktop Sidebar ------------------------ */
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? "w-56" : "w-16"
      } flex flex-col`}
    >
      {/* Logo */}
      <button onClick={() => navigate(`${PG_BASE}`)}>
            <img src="/RUFRENT6.png" alt="logo" className={`${tailwindStyles.logo} ml-6 mt-2`} />
            <div className="justify-self-start">
              <span className="text-xs md:text-sm lg:text-md pl-6 tracking-widest text-white">
                PG
              </span>
            </div>
          </button>

      {/* Role Menus */}
      <nav className="flex-1 overflow-auto px-1">
        <ul className="space-y-1">
          {roleMenus.map((role) => {
            const active = isGroupActive(role.children);
            const expanded = openKey === role.key || active;
            return (
              <li key={role.key}>
                <div
                  className={`flex items-center w-full px-2 py-2 rounded-md hover:bg-gray-800 transition ${
                    active ? "bg-gray-700 text-yellow-400" : ""
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenKey(expanded ? null : role.key);
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-800 focus:outline-none"
                    aria-label={`Toggle ${role.label} menu`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => handleRoleNavigate(role.dashboardTo)}
                    className={`flex-1 text-left ml-1 pr-2 py-1 rounded-md focus:outline-none ${
                      isOpen ? "block" : "hidden"
                    }`}
                  >
                    <span className={`flex items-center gap-2 font-semibold ${role.color}`}>
                      {role.label}
                    </span>
                  </button>
                </div>

                {expanded && (
                  <ul className="pl-10 pr-2 mt-1 space-y-1">
                    {role.children.map((child) => {
                      const isActive = location.pathname === child.to;
                      const Icon = child.icon;
                      return (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            end
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm hover:bg-gray-800 transition ${
                                isActive ? "bg-gray-700 text-yellow-400" : ""
                              }`
                            }
                          >
                            <Icon className="w-4 h-4" />
                            {isOpen && <span>{child.label}</span>}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-auto p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-gray-800 transition justify-start"
        >
          <LogOut className="w-6 h-6" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
