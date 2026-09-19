import React, { useState } from "react";
import { useNotifications } from "../context/NotificationContext";

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center font-semibold text-gray-700">
            <span>Notifications</span>
            {unreadCount > 0 ? (
              <button
                onClick={markAllAsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Mark all as read
              </button>
            ) : (
              <span className="text-xs text-gray-400">All read</span>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !item.isRead;

                return (
                  <div
                    key={item._id}
                    onClick={() => markAsRead(item._id)}
                    className={`p-3 text-sm cursor-pointer transition-colors flex items-start gap-2.5 ${
                      isUnread
                        ? "bg-blue-50/80 hover:bg-blue-100/80 border-l-4 border-indigo-600"
                        : "bg-white hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {/* Unread Indicator Dot */}
                    {isUnread && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                    )}

                    <div className="flex-1">
                      <p
                        className={`${
                          isUnread
                            ? "text-gray-900 font-semibold"
                            : "text-gray-600 font-normal"
                        }`}
                      >
                        {item.message}
                      </p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
