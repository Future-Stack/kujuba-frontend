import { baseApi } from "../api/baseApi";


export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   
    getReviews: builder.query({
      query: (filter) => `/review?filter=${filter}`,
      providesTags: ["Reviews"],
    }),


    getReviewMetrics: builder.query({
      query: () => "/review-matrics",
      providesTags: ["Reviews"],
    }),


    toggleReviewStatus: builder.mutation({
      query: (id: number) => ({
        url: `/review-toggle-admin/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Reviews"],
    }),


    suspendInspectorFromReview: builder.mutation({
      query: (id: number) => ({
        url: `/suspend-review-inspector/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewMetricsQuery,
  useToggleReviewStatusMutation,
  useSuspendInspectorFromReviewMutation,
} = reviewsApi;