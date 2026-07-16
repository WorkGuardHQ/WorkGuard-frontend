//src/services/notification.service.js
import { apiGet, apiPatch } from '../helpers/api';

export const fetchNotifications = (cursor) =>
  apiGet('/notifications', { params: cursor ? { cursor } : {} }).then((r) => r.data);

export const fetchUnreadCount = () =>
  apiGet('/notifications/unread-count').then((r) => r.data.count);

export const markNotificationRead = (id) =>
  apiPatch(`/notifications/${id}/read`).then((r) => r.data.notification);

export const markAllNotificationsRead = () =>
  apiPatch('/notifications/read-all').then((r) => r.data);
