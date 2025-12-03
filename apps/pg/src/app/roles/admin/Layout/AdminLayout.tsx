// src/admin/AdminLayout.tsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Components/AdminNavbar";

interface AdminLayoutProps {}

export default function AdminLayout({}: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex app-shell">
      {/* Only admins see this sidebar navbar */}
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content for admin pages */}
      <main
        className={`transition-all duration-300 flex-1 ${
          isMobile ? "pt-16 ml-0" : isOpen ? "ml-56" : "ml-16"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
