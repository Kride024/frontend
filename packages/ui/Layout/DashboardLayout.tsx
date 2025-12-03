import { useEffect, useState, FC } from "react";
import { Outlet } from "react-router-dom"; // Outlet is where the child page renders
// Assuming Navbar is a named export or default export from "./Navbar"
import Navbar from "@pg/app/shared/components/Navbar"; // Your VERTICAL dashboard navbar

// Define the component using the FC (Function Component) type
export const DashboardLayout: FC = () => {
  // Explicitly defining state types: boolean
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Define the type for the event handler's parameter (optional but good practice)
    const handleResize = () => setIsMobile(window.innerWidth < 640);

    handleResize();
    // No need to explicitly type 'window' as it's a global object
    window.addEventListener("resize", handleResize);

    // Explicitly define the return type for the cleanup function
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means it runs once on mount and cleanup on unmount

  // Determine the CSS margin class based on state
  const mainMarginClass: string = isMobile
    ? "pt-16 ml-0"
    : isOpen
    ? "ml-48" // When open (desktop)
    : "ml-16"; // When closed (desktop)

  return (
    <div className="flex app-shell">
      {/* The vertical dashboard navbar 
        Assuming Navbar accepts props: 
        - isOpen: boolean
        - setIsOpen: React.Dispatch<React.SetStateAction<boolean>> 
        (This type is automatically inferred by the useState setter function)
      */}
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area */}
      <main
        className={`transition-all duration-300 flex-1 app-main ${mainMarginClass}`}
      >
        {/* This Outlet renders the protected page (e.g., ODashboardOwner) */}
        <Outlet />
      </main>
    </div>
  );
};