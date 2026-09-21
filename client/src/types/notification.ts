export interface NotificationItem {
  _id: string;
  recipient: string;
  type: string;
  message: string;
  relatedJob?: string | { _id: string; title: string };
  relatedApplication?: string | { _id: string; status: string };
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => void;
}
