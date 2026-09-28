import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import type { NotificationItem } from "../types";

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsRead(item._id);
    }
    setIsOpen(false);

    // Route navigation based on notification type and role
    if (item.type === "NEW_APPLICATION") {
      const jobId =
        typeof item.relatedJob === "object"
          ? item.relatedJob?._id
          : item.relatedJob;
      if (jobId) {
        navigate(`/recruiter/jobs/${jobId}/applicants`);
      } else {
        navigate("/recruiter/jobs");
      }
    } else if (item.type === "APPLICATION_STATUS_UPDATED") {
      navigate("/candidate/applications");
    } else {
      if (user?.role === "recruiter") {
        navigate("/recruiter/jobs");
      } else if (user?.role === "candidate") {
        navigate("/candidate/applications");
      }
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors focus:outline-none cursor-pointer"
        aria-label="View notifications"
      >
        <svg
          className="w-5 h-5 sm:w-5.5 sm:h-5.5"
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
          <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-slate-950 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50 ring-2 ring-slate-950 animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Mobile Backdrop Overlay (Tap to Dismiss) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Notifications Dropdown / Modal */}
      {isOpen && (
        <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-88 max-h-[80vh] sm:max-h-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/10">
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/70">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 ? (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-emerald-500/10"
              >
                Mark all as read
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-medium">
                All caught up
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-800/80 overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <div className="mx-auto w-10 h-10 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center mb-2">
                  🔔
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-200">
                  No notifications yet
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  We&apos;ll notify you when application statuses change.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !item.isRead;

                return (
                  <div
                    key={item._id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 sm:p-4 text-xs sm:text-sm cursor-pointer transition-all flex items-start gap-3 active:bg-slate-800 group ${
                      isUnread
                        ? "bg-emerald-500/10 hover:bg-emerald-500/15 border-l-4 border-emerald-400"
                        : "bg-slate-900/60 hover:bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    {/* Unread dot */}
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                        isUnread
                          ? "bg-emerald-400 ring-2 ring-emerald-500/30"
                          : "bg-transparent"
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <p
                        className={`leading-snug break-words ${
                          isUnread
                            ? "text-white font-bold"
                            : "text-slate-300 font-normal"
                        }`}
                      >
                        {item.message}
                      </p>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1">
                          🕒 {new Date(item.createdAt).toLocaleDateString()}{" "}
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          {item.type === "NEW_APPLICATION"
                            ? "View Applicants →"
                            : item.type === "APPLICATION_STATUS_UPDATED"
                            ? "View Status →"
                            : "View →"}
                        </span>
                      </div>
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

