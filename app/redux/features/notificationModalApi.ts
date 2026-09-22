export {
  notificationApi,
  useGetNotificationsQuery,
  useGetAdminNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useMarkAsUnreadMutation,
} from "./notificationApi";

export type {
  AdminNotification as Notification,
  AdminNotificationsResponse as NotificationsResponse,
} from "./notificationApi";