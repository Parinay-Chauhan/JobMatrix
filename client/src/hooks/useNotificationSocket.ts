import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

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

  useEffect(() => {
    if (!socket || !isConnected) return;

    // 1. Recruiter Event: New Job Application Received
    const handleNewNotification = (data: NotificationPayload) => {
      console.log("🔔 [SOCKET EVENT] new_notification received:", data);
    };

    // 2. Candidate Event: Application Status Updated
    const handleStatusUpdated = (data: NotificationPayload) => {
      console.log("🔔 [SOCKET EVENT] application_status_updated received:", data);
    };


    socket.on("new_notification", handleNewNotification);
    socket.on("application_status_updated", handleStatusUpdated);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("application_status_updated", handleStatusUpdated);
    };
  }, [socket, isConnected]);
};