// apps/rentals/src/components/Navbar/NotificationBell.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import io, { Socket } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL as string;

interface NotificationBellProps {
  userId?: string | number;
  onClick: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId, onClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userId) return;
      try {
        const { data } = await axios.get(`${apiUrl}/noti/unread/${userId}`);
        setUnreadCount(data.notifications?.length || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(`${apiUrl}/notifications`, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinNotifications", userId);
    });

    newSocket.on("receiveNotification", (notifications: any[]) => {
      if (Array.isArray(notifications)) {
        setUnreadCount((prev) => prev + notifications.length);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <button onClick={onClick} className="relative flex items-center">
      <img src="/Navbar/Bell.png" className="h-6" alt="notifications" />
      {unreadCount > 0 && (
        <span className="absolute top-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 -translate-y-1/2 -translate-x-1/2">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;