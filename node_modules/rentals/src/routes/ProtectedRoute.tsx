// apps/rentals/src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useRoleStore } from "../../../../packages/store/roleStore";

const JWT_SECRET_KEY = import.meta.env.VITE_JWT_SECRET_KEY;

interface ProtectedRouteProps {
  roles: string[];
  setIsModalOpen: (open: boolean) => void;
  setIntendedPath: (path: string) => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roles,
  setIsModalOpen,
  setIntendedPath,
}) => {
  const { userData } = useRoleStore();
  const location = useLocation();
  const jwtToken = Cookies.get(JWT_SECRET_KEY);
  const isLoggedIn = !!jwtToken;

  // Not logged in → open modal + redirect
  if (!isLoggedIn || !userData?.role) {
    setIntendedPath(location.pathname + location.search);
    setIsModalOpen(true);
    return <Navigate to="/" replace />;
  }

  // Normalize role
  const userRole = userData.role.trim().toLowerCase();
  const normalizedRole =
    userRole === "user" ? "User" :
    userRole === "rm" ? "RM" :
    userRole === "fm" ? "FM" :
    userRole === "admin" ? "Admin" :
    userRole === "vendor" ? "Vendor" :
    null;

  if (!normalizedRole || !roles.includes(normalizedRole)) {
    return <Navigate to="/unauthorize" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;