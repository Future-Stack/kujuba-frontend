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
  is_archived: boolean;  
  homeowner_feedback: string | null;  
  is_favorite: boolean;
  report_details: ReportDetails;
}

export interface ReportStats {
  total_reports: number;
  total_started_reports: number;
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

export interface ReportQueryParams {
  page?: number;
  is_archived?: 0 | 1;
  status?: string;
}

// ================= API =================

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<
      { reports: Report[]; pagination: Pagination },
      ReportQueryParams
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        queryParams.set("page", String(params.page ?? 1));
        if (params.is_archived !== undefined) queryParams.set("is_archived", String(params.is_archived));
        if (params.status) queryParams.set("status", params.status);
        return `/admin/reports?${queryParams.toString()}`;
      },
      transformResponse: (response: any) => response.data,
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

    restoreReport: builder.mutation<
      { message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/reports/${id}/restore`,
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
  useRestoreReportMutation
} = reportsApi;