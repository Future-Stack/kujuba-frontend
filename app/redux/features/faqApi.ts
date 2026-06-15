/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../api/baseApi";

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL FAQS
    getFaqs: builder.query<any, void>({
      query: () => "/faqs",
      providesTags: ["Faq"],
    }),

    // CREATE FAQ
    addFaq: builder.mutation({
      query: (data) => ({
        url: "/faqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Faq"],
    }),

    // UPDATE FAQ
    updateFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faqs/${id}`,
        method: "PUT", 
        body: data,
      }),
      invalidatesTags: ["Faq"],
    }),

    // DELETE FAQ
    deleteFaq: builder.mutation({
      query: (id: number) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faq"],
    }),

  }),
});

export const {
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;