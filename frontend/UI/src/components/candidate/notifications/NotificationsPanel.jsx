import { useEffect, useRef, useState } from "react";
import { FiBell, FiCheck, FiFileText, FiTrendingUp, FiInfo } from "react-icons/fi";

import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../../../services/notificationService";

const typeIcons = {
  application: FiFileText,
  status: FiTrendingUp,
  system: FiInfo,
};

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef(null);

  const refresh = async () => {
    try {
      const [notificationsData, unreadCountData] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);
      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch {
      // Leave the last-known state on the screen rather than clearing it.
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen) refresh();
    setIsOpen((prev) => !prev);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    refresh();
  };

  const handleNotificationClick = async (id) => {
    await markAsRead(id);
    refresh();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative text-gray-500 hover:text-blue-600"
        aria-label="Notifications"
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-3 w-80 max-w-[90vw] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <FiCheck /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = typeIcons[notification.type] || FiInfo;

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 ${
                      !notification.isRead ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="mt-0.5 rounded-md bg-blue-100 p-1.5 text-blue-600">
                      <Icon className="text-sm" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-5 text-gray-500">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
