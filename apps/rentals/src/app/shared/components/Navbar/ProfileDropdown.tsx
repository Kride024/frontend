



import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useRoleStore } from "../../../../../../../packages/store/roleStore";
import useFilterStore from "../../../store/filterStore";
import useActionsListingsStore from "../../../store/actionsListingsStore";
import { RENTALS_BASE } from "@packages/config/constants";

const jwtSecretKey = import.meta.env.VITE_JWT_SECRET_KEY as string;

// Props
interface ProfileDropdownProps {
  toggleMenu?: () => void;
}

interface MenuItem {
  label: string;
  path?: string;
  action?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ toggleMenu = () => {} }) => {
  const navigate = useNavigate();

  const resetFilters = useFilterStore((state) => state.resetStore);
  const resetActionsStore = useActionsListingsStore((state) => state.resetStore);
  const { resetStore } = useRoleStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async (): Promise<void> => {
    try {
      Cookies.remove(jwtSecretKey);
      await resetFilters();
      await resetActionsStore();
      await resetStore();
      localStorage.clear();

      navigate("/", { replace: true });
     
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Profile", path: "profile" },
    { label: "My Transaction", path: "transactions" },
    // { label: "My Services", path: "myservices" },
    { label: "Logout", action: handleLogout },
  ];

  const handleToggle = (): void => {
    setIsOpen((prev) => !prev);
    toggleMenu();
  };

  const handleItemClick = (path?: string, action?: () => void): void => {
    setIsOpen(false);

    if (path) {
      navigate(`${RENTALS_BASE}/${path}`);
    } else if (action) {
      action();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={handleToggle} className="cursor-pointer">
        <img
          src="/Navbar/User.png"
          alt="user_icon"
          className="h-7"
          style={{ color: "#FFC156" }}
        />
      </div>

      {isOpen && (
        <div className="absolute top-8 -right-14 md:-right-16 mt-2 w-36 bg-white rounded-md shadow-lg z-50">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item.path, item.action)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
