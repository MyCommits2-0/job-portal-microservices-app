import { createApiClient } from "../utils/httpClient";

const NOTIFICATION_API_BASE_URL =
  import.meta.env.VITE_NOTIFICATION_SERVICE_URL ||
  "http://localhost:8080/notifications";

// createApiClient (not a bare axios instance) so every call carries the
// signed-in user's access token - the gateway derives X-User-Id from it
// and forwards that as a trusted header to NotificationService.
const api = createApiClient(NOTIFICATION_API_BASE_URL);

export const getNotifications = async () => {
  const response = await api.get("/me");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get("/unread-count");
  return response.data.count;
};

export const markAsRead = async (notificationId) => {
  await api.patch(`/${notificationId}/read`);
};

export const markAllAsRead = async () => {
  await api.patch("/mark-all-read");
};
