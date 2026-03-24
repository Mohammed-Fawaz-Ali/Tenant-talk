import { useEffect, useState, useRef } from "react";
import { fetchNotifications, markNotificationRead } from "../api/notifications";

export default function Topbar() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const loadNotifications = async () => {
    try {
      const res = await fetchNotifications();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (error) {
      console.error("Failed to mark notification read", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setOpen((prev) => !prev);

  return (
    <div className="h-14 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-6 relative">
      <div className="text-slate-600 font-semibold">Welcome back</div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="relative text-2xl hover:text-slate-700 transition"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-auto rounded-md bg-white border border-slate-200 shadow-lg z-40">
              <div className="px-3 py-2 border-b border-slate-100 font-semibold">Notifications</div>
              {notifications.length === 0 ? (
                <div className="p-3 text-slate-500">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`px-3 py-2 border-b border-slate-100 cursor-pointer ${
                      notification.read ? "bg-white" : "bg-slate-50"
                    }`}
                    onClick={() => {
                      if (!notification.read) markRead(notification._id);
                    }}
                  >
                    <div className="text-sm text-slate-800">{notification.message}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(notification.createdAt).toLocaleString()}
                      {notification.read ? " • read" : " • unread"}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-1.5 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
