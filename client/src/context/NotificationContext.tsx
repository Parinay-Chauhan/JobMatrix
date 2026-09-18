import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSocket } from "./SocketContext";
import api from "../api/axios";

export interface NotificationItem {
  _id: string;
  recipient: string;
  type: string;
  message: string;
  relatedJob?: string;
  relatedApplication?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  clearAll: () => {},
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { socket, isConnected } = useSocket();

  // 1. Initial Unread Notifications fetch from Backend
  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        if (response.data?.data) {
          setNotifications(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchInitialNotifications();
  }, []);

  // 2. Real-time Socket Event Listener
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleIncomingNotification = (newNotif: NotificationItem) => {
      console.log("🔔 Live Notification Received:", newNotif);

      // Append new notification to top of the list
      setNotifications((prev) => [newNotif, ...prev]);

      // Play soft audio alert sound (Optional)
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(() => {}); // ignore auto-play restriction blocks
      } catch (err) {}
    };

    socket.on("application_status_updated", handleIncomingNotification);
    socket.on("new_notification", handleIncomingNotification);

    return () => {
      socket.off("application_status_updated", handleIncomingNotification);
      socket.off("new_notification", handleIncomingNotification);
    };
  }, [socket, isConnected]);

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);