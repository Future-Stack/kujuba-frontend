/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../api/baseApi";



export interface ReportMedia {
  photos: string[];
  videos: string[];
}

export interface ReportDetails {
  notes: string;
  media: ReportMedia;
  report_file: string;
}

export interface Report {
  id: number;
  user_name: string;
  location: string | null;
  inspection_id: string;
  report_id: string;
  inspector_email: string;
  created_date: string;
  status: string;
  is_favorite: boolean;
  report_details: ReportDetails;
}

export interface ReportStats {
  total_reports: number;
  // total_pending_reports: number;
  total_completed_reports: number;
  total_cancelled_reports: number;
  total_archived_reports: number;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

// ================= API =================

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getReports: builder.query<
      { reports: Report[]; pagination: Pagination },
      number | void
    >({
      query: (page = 1) => `/admin/reports?page=${page}`,
        transformResponse: (response: any) => response.data, // 👈 add this
      providesTags: ["Reports"],
    }),


    getReportById: builder.query<Report, number>({
      query: (id) => `/admin/reports/${id}`,
      providesTags: ["Reports"],
    }),

  
    getReportStats: builder.query<ReportStats, void>({
      query: () => "/admin/reports/stats",
      providesTags: ["Reports"],
    }),


   toggleReportFavorite: builder.mutation<
  { success: boolean; message: string; data: { id: number; is_favorite: boolean } },
  number
>({
  query: (id) => ({
    url: `/admin/reports/${id}/favorite`,
    method: "POST",
  }),
  invalidatesTags: ["Reports"],
}),


    archiveReport: builder.mutation<
      { message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/reports/${id}/archive`,
        method: "POST",
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});


export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGetReportStatsQuery,
  useToggleReportFavoriteMutation,
  useArchiveReportMutation,
} = reportsApi;