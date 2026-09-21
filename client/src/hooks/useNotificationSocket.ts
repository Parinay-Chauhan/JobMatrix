import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../context/SocketContext";
import { queryKeys } from "./queryKeys";

export interface NotificationPayload {
  _id?: string;
  recipient: string;
  sender?: {
    _id: string;
    fullName: string;
  };
  type: string;
  message: string;
  jobId?: string;
  applicationId?: string;
  isRead?: boolean;
  createdAt?: string;
}

export const useNotificationSocket = () => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // 1. Recruiter Event: New Job Application Received
    const handleNewNotification = (data: NotificationPayload) => {
      console.log("🔔 [SOCKET EVENT] new_notification received:", data);
      // Invalidate relevant recruiter queries for instant reactive UI updates
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.stats() });
    };

    // 2. Candidate Event: Application Status Updated
    const handleStatusUpdated = (data: NotificationPayload) => {
      console.log("🔔 [SOCKET EVENT] application_status_updated received:", data);
      // Invalidate candidate applications query for instant status refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.mine() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("application_status_updated", handleStatusUpdated);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("application_status_updated", handleStatusUpdated);
    };
  }, [socket, isConnected, queryClient]);
};