import { baseApi } from "../api/baseApi";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type?: string;
  recipients?: number;
  sent_to?: string;
  sent_at: string;
  status?: string;
  is_read?: boolean;
  read_at?: string | null;
  created_at?: string;
}

export interface AdminNotificationsResponse {
  success?: boolean;
  total?: number;
  unread_count?: number;
  data: AdminNotification[];
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send Notification (POST /store-sent-notifications)
    sendNotification: builder.mutation({
      query: (data) => ({
        url: "/store-sent-notifications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Get All Sent Notifications (GET /all-notifications)
    getAllNotifications: builder.query({
      query: () => ({
        url: "/all-notifications",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

    // Get Admin Notifications (GET /admins-notifications)
    getAdminNotifications: builder.query<AdminNotificationsResponse, void>({
      query: () => ({
        url: "/admins-notifications",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),

    // Mark Notification as Read (POST /admin/notifications/:id/read)
    markAsRead: builder.mutation<{ success: boolean; message?: string }, string | number>({
      query: (id) => ({
        url: `/admin/notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["notifications"],
    }),

    // Mark All Notifications as Read (POST /admin/notifications/read-all)
    markAllAsRead: builder.mutation<{ success: boolean; message?: string }, void>({
      query: () => ({
        url: "/admin/notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: ["notifications"],
    }),

    // Mark Notification as Unread (POST /admin/notifications/:id/unread)
    markAsUnread: builder.mutation<{ success: boolean; message?: string }, string | number>({
      query: (id) => ({
        url: `/admin/notifications/${id}/unread`,
        method: "POST",
      }),
      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useSendNotificationMutation,
  useGetAllNotificationsQuery,
  useGetAdminNotificationsQuery,
  useGetAdminNotificationsQuery: useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useMarkAsUnreadMutation,
} = notificationApi;