import api from "../api/axios";
import type { ApiResponse, NotificationItem } from "../types";

export const notificationService = {
  // Get all notifications for logged-in user
  async getMyNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    const response =
      await api.get<ApiResponse<NotificationItem[]>>("/notifications");
    return response.data;
  },

  // Get count of unread notifications
  async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    const response = await api.get<ApiResponse<{ unreadCount: number }>>(
      "/notifications/unread-count",
    );
    return response.data;
  },

  // Mark single notification as read
  async markAsRead(id: string): Promise<ApiResponse<NotificationItem>> {
    const response = await api.patch<ApiResponse<NotificationItem>>(
      `/notifications/${id}/read`,
    );
    return response.data;
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<
    ApiResponse<{ modifiedCount: number }>
  > {
    const response = await api.patch<ApiResponse<{ modifiedCount: number }>>(
      "/notifications/read-all",
    );
    return response.data;
  },
};
