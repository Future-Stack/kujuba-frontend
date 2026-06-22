import { baseApi } from "../api/baseApi";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  recipients: number;
  sent_to: string;
  sent_at: string;
  status: string;
}

export interface NotificationsResponse {
  success: boolean;
  total: number;
  data: Notification[];
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, void>({
      query: () => ({
        url: "/admins-notifications",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;