import { baseApi } from "../api/baseApi";


export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Send Notification
    sendNotification: builder.mutation({
      query: (data) => ({
        url: "/store-sent-notifications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Get All Notifications
    getAllNotifications: builder.query({
      query: () => ({
        url: "/all-notifications",
        method: "GET",
      }),
      providesTags: ["Notifications"],
    }),

  }),
});

export const {
  useSendNotificationMutation,
  useGetAllNotificationsQuery,
} = notificationApi;