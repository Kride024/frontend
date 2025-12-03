// src/components/CommonViews/AppAwareNavbar.tsx
import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../../apps/rentals/src/app/shared/components/Navbar/Navbar";
// import StudioNavbar from "../../StudioView/commonViews/StudioNavbar";
// import { PGNavbar } from "../../PG/Common/LandingPage/PGNavbar";
import { RENTALS_BASE, STUDIO_BASE, PG_BASE } from "../config/constants";

// Props are unknown because you spread {...props}.
// If you want strong typing, pass the props interface here.
interface AppAwareNavbarProps {
  [key: string]: unknown;
}

const AppAwareNavbar: React.FC<AppAwareNavbarProps> = (props) => {
  const { pathname, search } = useLocation();

  const urlParams = new URLSearchParams(search);
  const appFromQuery = urlParams.get("app"); // "studio" | "rentals" | "pg" | null

  const isStudio =
    appFromQuery === "studio" || pathname.startsWith(STUDIO_BASE);

  const isRentals =
    appFromQuery === "rentals" ||
    pathname.startsWith(RENTALS_BASE) ||
    pathname.startsWith("/base/footer");

  const isPg = appFromQuery === "pg" || pathname.startsWith(PG_BASE);

//   if (isStudio) return <StudioNavbar {...props} />;
//   if (isPg) return <PGNavbar {...props} />;

  return <Navbar {...props} />;
};

export default AppAwareNavbar;
