//src/context/NotificationContext.jsx


import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { getToken } from "../helpers/tokenHelper";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notification.service';
import { connectNotificationSocket, disconnectNotificationSocket } from '../socket/notificationSocket';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);

  const reset = useCallback(() => {
  initialized.current = false;

  setNotifications([]);
  setUnreadCount(0);
  setNextCursor(null);
  setLoading(false);

  disconnectNotificationSocket();
}, []);

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    try {
      const { data, nextCursor: cursor } = await fetchNotifications();
      setNotifications(data);
      setNextCursor(cursor);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading) return;
    setLoading(true);
    try {
      const { data, nextCursor: cursor } = await fetchNotifications(nextCursor);
      setNotifications((prev) => [...prev, ...data]);
      setNextCursor(cursor);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading]);

  const refreshUnreadCount = useCallback(async () => {
    const count = await fetchUnreadCount();
    setUnreadCount(count);
  }, []);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationRead(id);
    } catch (err) {
  console.warn("Failed to mark notification as read:", err);
}
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    }catch (err) {
  console.warn("Failed to mark all notifications as read:", err);
}
  }, []);



const initialize = useCallback(async () => {
  const token = getToken();

  if (!token || initialized.current) return null;

  initialized.current = true;

  await Promise.all([
    loadFirstPage(),
    refreshUnreadCount(),
  ]);

  return connectNotificationSocket();
}, [loadFirstPage, refreshUnreadCount]);

// Socket event handlers
// const onNew = useCallback((notification) => {
//   console.log("🔔 SOCKET RECEIVED", notification);
// let added = false;

//   setNotifications((prev) => {
//     if (prev.some((n) => n._id === notification._id)) {
//       return prev;
//     }

//     setUnreadCount((c) => c + 1);

//     return [notification, ...prev];
//   });
// }, []);

const onNew = useCallback((notification) => {
  let added = false;

  setNotifications((prev) => {
    if (prev.some((n) => n._id === notification._id)) {
      return prev;
    }

    added = true;
    return [notification, ...prev];
  });

  if (added) {
    setUnreadCount((c) => c + 1);
  }
}, []);

const onUpdated = useCallback((update) => {
  setNotifications((prev) =>
    update.all
      ? prev.map((n) => ({ ...n, isRead: update.isRead }))
      : prev.map((n) =>
          n._id === update._id
            ? { ...n, isRead: update.isRead }
            : n
        )
  );
}, []);

useEffect(() => {
  let socket = null;

  const setup = async () => {
    socket = await initialize();

    if (!socket) return;

    socket.off("notification:new", onNew);
    socket.off("notification:updated", onUpdated);

    socket.on("notification:new", onNew);
    socket.on("notification:updated", onUpdated);
  };

  const handleAuthChanged = async () => {
    reset();
    await setup();
  };

  window.addEventListener("auth-changed", handleAuthChanged);

  setup();

  return () => {
    window.removeEventListener("auth-changed", handleAuthChanged);

    if (socket) {
      socket.off("notification:new", onNew);
      socket.off("notification:updated", onUpdated);
    }

    disconnectNotificationSocket();
  };
}, [initialize, onNew, onUpdated, reset]);

// useEffect(() => {
//   let socket = null;

// const setup = async () => {
//   socket = await initialize();

//   if (!socket) return;

//   socket.off("notification:new", onNew);
//   socket.off("notification:updated", onUpdated);

//   socket.on("notification:new", onNew);
//   socket.on("notification:updated", onUpdated);
// };

//   // سجل الـ listener أولاً
//   window.addEventListener("auth-changed", setup);

//   // ثم حاول تعمل setup
//   setup();

//   return () => {
//     window.removeEventListener("auth-changed", setup);

//     if (socket) {
//       socket.off("notification:new", onNew);
//       socket.off("notification:updated", onUpdated);
//     }

//     disconnectNotificationSocket();
//   };
// }, [initialize, onNew, onUpdated]);
// Public API exposed to the rest of the application.
  const value = {
    notifications,
    unreadCount,
    hasMore: Boolean(nextCursor),
    loading,
    loadMore,
    markAsRead,
    markAllAsRead,
    reload: loadFirstPage,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
