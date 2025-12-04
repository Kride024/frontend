// c:\Users\LENOVO\Downloads\frontend\apps\pg\src\app\shared\components\Navbar.tsx
import React, { JSX, useEffect, useState, useRef } from "react";
import {
  BarChart2,
  Bath,
  Bed,
  Clock,
  Home,
  MapPin,
  Megaphone,
  Settings,
  Snowflake,
  TrendingUp,
} from "lucide-react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assests/logo.png";
import { PG_BASE } from "@packages/config/constants";
// Importing logout function
import { useAuth } from "../../shared/hooks/context/AuthContext";

// Types for Navbar Props
interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Types for Promo Card Props
interface PromoPGCardProps {
  img?: string;
  name?: string;
  location?: string;
  amenities?: string[];
  roomTypes?: string[];
  onList?: () => void;
}

// Types for Nav Item
interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
  emphasis?: boolean;
}

export default function Navbar({ isOpen, setIsOpen }: NavbarProps) {
  const [viewportW, setViewportW] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const isMobile = viewportW < 640;
  const isTablet = viewportW >= 640 && viewportW < 784;
  const isDesktop = viewportW >= 784;

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  // --- Mobile hamburger menu state & helpers (top-level so hooks order is stable)
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // close menu when clicking outside (attached once)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const openMenu = () => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowMenu(true);
  };

  const closeMenu = () => {
    hoverTimeoutRef.current = window.setTimeout(() => setShowMenu(false), 7000);
  };

  const navItems: NavItem[] = [
    { to: `${PG_BASE}/dashboard`, label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { to: `${PG_BASE}/occupancy`, label: "Occupancy", icon: <BarChart2 className="w-5 h-5" /> },
    { to: `${PG_BASE}/pending-dues`, label: "Pending Dues", icon: <Clock className="w-5 h-5" /> },
    { to: `${PG_BASE}/profitibility`, label: "Profitibility", icon: <TrendingUp className="w-5 h-5" /> },
    {
      to: `${PG_BASE}/ads`,
      label: "PG Ads",
      icon: <Megaphone className="w-5 h-5" />,
      emphasis: true,
    },
  ];

  useEffect(() => {
    const handleResize = () => setViewportW(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure sidebar is closed on tablet/mobile so content uses full width
  useEffect(() => {
    if (!isDesktop && isOpen) {
      setIsOpen(false);
    }
    // do not re-open the sidebar automatically on desktop; parent controls it
    // dependency intentionally includes viewportW and isOpen
  }, [viewportW, isOpen, isDesktop, setIsOpen]);

  /* ----- Top Horizontal Navbar for Mobile + Tablet ------ */
  if (!isDesktop) {
    return (
      <div className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 bg-[#001433] shadow-sm z-50">
        <div
          className="h-9 w-28 bg-contain bg-no-repeat bg-left cursor-pointer"
          style={{ backgroundImage: `url(${logo})` }}
          onClick={() => navigate(`${PG_BASE}/dashboard`)}
        />
        <div className="flex items-center gap-3 relative" ref={menuRef}>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-expanded={showMenu}
            aria-haspopup="true"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((s) => !s);
            }}
            onMouseEnter={openMenu}
          >
            <div className="flex flex-col justify-center items-center space-y-1.5">
              <span className="block w-5 h-0.5 bg-white rounded"></span>
              <span className="block w-5 h-0.5 bg-white rounded"></span>
              <span className="block w-5 h-0.5 bg-white rounded"></span>
            </div>
          </button>

          {/* Popover menu */}
          {showMenu && (
            <div
              className="fixed right-0 top-14 w-56 bg-white rounded-lg shadow-lg text-slate-800 overflow-hidden origin-top-right z-50"
              role="menu"
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
            >
              <ul className="flex flex-col">
                {navItems.map((item, idx) => (
                  <li key={idx} className="border-b last:border-b-0">
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-slate-100 flex items-center gap-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        navigate(item.to);
                      }}
                      role="menuitem"
                    >
                      <span className="text-slate-600">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ----- Desktop Sidebar ------ */
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? "w-56" : "w-16"
      } flex flex-col`}
    >
      {/* Toggle Button or Logo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-center hover:bg-gray-800 rounded-lg"
      >
        {isOpen ? (
          <div
            className="h-8 w-28 bg-contain bg-no-repeat bg-center cursor-pointer"
            style={{ backgroundImage: `url(${logo})` }}
            onClick={() => navigate(`${PG_BASE}/dashboard`)}
          />
        ) : (
          <div className="flex flex-col justify-center space-y-1 cursor-pointer mt-3">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        )}
      </button>

      {/* Navigation Links */}
      <nav className="mt-2 overflow-auto">
        <ul className="flex flex-col space-y-2 px-0.5">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.to;
            const base =
              "relative flex items-center gap-3 px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
            const normal = isActive ? "bg-gray-700 text-yellow-400" : "hover:bg-gray-800";
            const emphasized =
              "bg-gradient-to-r from-amber-400/20 to-orange-500/20 hover:from-amber-400/30 hover:to-orange-500/30";

            return (
              <li key={idx}>
                <NavLink
                  to={item.to}
                  end={item.label === "Dashboard"}
                  className={`${base} ${item.emphasis ? emphasized : normal}`}
                >
                  <span className="text-white relative">
                    {item.icon}
                    {item.emphasis && !isOpen && !isActive && (
                      <>
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-amber-400 rounded-full animate-ping"></span>
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full"></span>
                      </>
                    )}
                  </span>
                  {isOpen && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Promo Card */}
        {isOpen && (
          <div className="px-3 pt-3 pb-2">
            <PromoPGCard onList={() => navigate(`${PG_BASE}/ads/new`)} />
          </div>
        )}
      </nav>
    </aside>
  );
}

/* PromoPGCard Component */
function PromoPGCard({
  img = "https://picsum.photos/seed/pgx/400/280",
  name = "Sunrise Comfort PG",
  location = "Madhapur, Hyderabad",
  amenities = ["AC"],
  roomTypes = ["Triple", "Double"],
  onList = () => {},
}: PromoPGCardProps) {
  const amenityIcon = (label: string): JSX.Element => {
    const k = label.toLowerCase();
    if (k.includes("ac")) return <Snowflake className="w-4 h-4" />;
    if (k.includes("washroom") || k.includes("bath")) return <Bath className="w-4 h-4" />;
    return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />;
  };

  const chips = [
    ...amenities.map((a) => ({ label: a, tone: "emerald", icon: amenityIcon(a) })),
    ...roomTypes.map((r) => ({ label: r, tone: "slate", icon: <Bed className="w-3.5 h-3.5" /> })),
  ];

  const toneClasses = (tone: string) =>
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <article className="relative rounded-2xl overflow-hidden shadow-lg border border-amber-300 bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500">
      <div className="absolute inset-[1.5px] rounded-[14px] bg-gradient-to-br from-amber-100/70 to-yellow-100/60 pointer-events-none" />
      <div className="relative p-2">
        <img src={img} alt={name} className="h-28 w-full object-cover rounded-xl border shadow" />
        <h3 className="mt-2 text-sm font-extrabold text-[#1f2a37] leading-tight">{name}</h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[#334155]">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{location}</span>
        </p>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {chips.map((c, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium border ${toneClasses(
                c.tone
              )}`}
            >
              {c.icon}
              <span className="truncate">{c.label}</span>
            </span>
          ))}
        </div>

        <button
          onClick={onList}
          className="mt-3 w-full px-3 py-2 rounded-xl font-semibold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow active:scale-[0.98] transition"
        >
          List My PG
        </button>
      </div>
    </article>
  );
}