import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSocket } from "./SocketContext";
import { notificationService } from "../services";
import type { NotificationItem, NotificationContextType } from "../types";

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  clearAll: () => {},
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { socket, isConnected } = useSocket();

  // 1. Initial Notifications fetch from Backend
  useEffect(() => {
    let isMounted = true;

    const fetchInitialNotifications = async () => {
      try {
        const response = await notificationService.getMyNotifications();
        if (response.data && isMounted) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchInitialNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Real-time Socket Event Listener
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleIncomingNotification = (newNotif: NotificationItem) => {
      // Append new notification to top of the list
      setNotifications((prev) => [newNotif, ...prev]);

      // Play soft audio alert sound (Optional)
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(() => {});
      } catch {
        // audio playback might be restricted
      }
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
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);
