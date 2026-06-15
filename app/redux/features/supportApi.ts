/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../api/baseApi";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getSupportTickets: builder.query<any, void>({
      query: () => "/admin/support",
      providesTags: ["Support"],
    }),

  
    replySupportTicket: builder.mutation({
      query: ({
        id,
        reply,
      }: {
        id: number;
        reply: string;
      }) => ({
        url: `/admin/support/${id}/reply`,
        method: "POST",
        body: {
          reply,
        },
      }),
      invalidatesTags: ["Support"],
    }),

  }),
});

export const {
  useGetSupportTicketsQuery,
  useReplySupportTicketMutation,
} = supportApi;