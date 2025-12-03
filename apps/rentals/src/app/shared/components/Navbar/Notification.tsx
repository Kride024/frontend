// apps/rentals/src/components/Navbar/NotificationComponent.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { ChevronRight } from "lucide-react";
import tailwindStyles from "../../../../../../../packages/styles/tailwindStyles";

const apiUrl = import.meta.env.VITE_API_URL as string;

interface Notification {
  Id: number;
  Notification_Id: number;
  Type: string;
  Text: string;
  Status: 0 | 1;
  CreateTime: string;
}

interface NotificationComponentProps {
  userId?: string | number;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ userId }) => {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`${apiUrl}/noti/all/${userId}`);
      const unread = data.notifications.filter((n: Notification) => n.Status === 0);
      const read = data.notifications.filter((n: Notification) => n.Status === 1);
      setUnreadNotifications(unread);
      setAllNotifications(read);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await axios.patch(`${apiUrl}/noti/m_read`, { dy_noti_id: notificationId });
      const noti = unreadNotifications.find((n) => n.Id === notificationId);
      if (noti) {
        setUnreadNotifications((prev) => prev.filter((n) => n.Id !== notificationId));
      
        setAllNotifications((prev) => [...prev, { ...noti, Status: 1 }]);
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    if (!userId) return;
    try {
      await axios.patch(`${apiUrl}/noti/markAllRead`, { userId });
      setAllNotifications((prev) => [
        ...prev,
        ...unreadNotifications.map((n) => ({ ...n, Status: 1 })),
      ]);
      setUnreadNotifications([]);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const newSocket = io(`${apiUrl}/notifications`, { transports: ["websocket"] });
    setSocket(newSocket);
    newSocket.on("connect", () => newSocket.emit("joinNotifications", userId));
    newSocket.on("receiveNotification", (notifications: Notification[]) => {
      if (Array.isArray(notifications)) {
        setUnreadNotifications((prev) => [...notifications, ...prev]);
      }
    });
    return () => newSocket.disconnect();
  }, [userId]);

  const handleCardClick = (notificationId: number) => {
    if ([1, 2].includes(notificationId)) {
      navigate("/user/mylistings");
    } else if ([3, 4, 5].includes(notificationId)) {
      navigate("/user/myfavorites");
    }
  };

  const displayed = activeTab === "all"
    ? [...unreadNotifications, ...allNotifications]
    : unreadNotifications;

  return (
    <div className={`${tailwindStyles.mainBackground} h-full overflow-y-auto`}>
      <div className="p-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-semibold rounded-md ${
              activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-4 py-2 text-sm font-semibold rounded-md ${
              activeTab === "unread" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
            }`}
          >
            Unread ({unreadNotifications.length})
          </button>
        </div>

        {activeTab === "unread" && unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllRead} className="w-full mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Mark All as Read
          </button>
        )}

        <div className="space-y-4">
          {displayed.map((notification) => (
            <div
              key={notification.Id}
              className={`p-4 rounded-lg ${tailwindStyles.whiteCard} shadow-md cursor-pointer`}
              onClick={() => {
                handleCardClick(notification.Notification_Id);
                if (notification.Status === 0) handleMarkAsRead(notification.Id);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-medium ${tailwindStyles.heading_4}`}>{notification.Type}</h3>
                  <p className={`mt-1 ${tailwindStyles.paragraph}`}>{notification.Text}</p>
                  <p className={`mt-2 ${tailwindStyles.paragraph_b}`}>
                    {notification.CreateTime
                      ? new Date(notification.CreateTime).toLocaleString()
                      : "Unknown Date"}
                  </p>
                </div>
                {notification.Status === 0 && (
                  <ChevronRight className="chevron-right h-5 w-5 text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;