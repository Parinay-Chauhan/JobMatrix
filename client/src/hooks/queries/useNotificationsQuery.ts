import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../../services";
import { queryKeys } from "../queryKeys";
import type { NotificationItem } from "../../types";

// 1. Fetch User Notifications
export const useNotificationsQuery = () => {
  return useQuery<NotificationItem[]>({
    queryKey: queryKeys.notifications.all,
    queryFn: async () => {
      const response = await notificationService.getMyNotifications();
      const raw = response as unknown as {
        notifications?: NotificationItem[];
        data?: NotificationItem[];
      };
      return raw.notifications || raw.data || (Array.isArray(response) ? response : []);
    },
  });
};

// 2. Mark Notification as Read Mutation
export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
