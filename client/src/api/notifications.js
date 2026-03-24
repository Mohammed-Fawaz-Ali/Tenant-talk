import API from "./axios";

export const fetchNotifications = () => API.get("/notifications");
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
