import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // 1. If user is not logged in, send them to the landing page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // 2. If user is logged in but has the WRONG role (e.g., a guest trying to see /owner)
    //    Send them to an "Unauthorized" page
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // 3. If user is logged in AND has the correct role, show the page
  return <Outlet />;
};