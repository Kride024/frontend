// apps/rentals/src/components/Navbar/SyncNotification.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import NotificationBell from "./NotificationBell";
import NotificationComponent from "./Notification";
import { useRoleStore } from "../../../../../../../packages/store/roleStore";
import tailwindStyles from "../../../../../../../packages/styles/tailwindStyles";

const SyncNotification: React.FC = () => {
  const { userData } = useRoleStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const userId = userData?.id;

  const handleNotificationBellClick = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <>
      <NotificationBell userId={userId} onClick={handleNotificationBellClick} />

      {showNotifications && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleNotificationBellClick}
        >
          <div
            className="fixed md:right-5 top-0 h-full md:h-[500px] w-full md:w-[300px] bg-gray-200 rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`p-4 border-b border-gray-200 flex justify-between items-center ${tailwindStyles.header}`}
            >
              <h1 className="text-xl font-semibold">Notifications</h1>
            </div>

            <button
              onClick={handleNotificationBellClick}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              <X className="h-7 w-7" />
            </button>

            <NotificationComponent userId={userId} />
          </div>
        </div>
      )}
    </>
  );
};

export default SyncNotification;