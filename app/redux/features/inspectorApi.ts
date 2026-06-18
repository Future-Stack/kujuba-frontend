import { baseApi } from "../api/baseApi";


export interface Inspector {
  id: number;
  name: string;
  email: string;
  status: string;
  image: string | null;
  phone: string;
  inspection_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface InspectorDetails {
  id: number;
  name: string;
  email: string;
  status: string;
  image: string | null;
  phone: string;
  location: string | null;
  license_number: string | null;
  license_expiry: string | null;
  insurance_expiry: string | null;
  member_since: string;
  specializations: string[];
  reviews: {
    average_rating: number;
    total_reviews: number;
  };
  performance: {
    completed: number;
    cancelled: number;
  };
  total_earnings: number;
  total_earnings_formatted: string;
  created_at: string;
  updated_at: string;
}

export interface InspectorStats {
  total_inspectors: number;
  total_inspectors_growth: number;
  active_inspections: number;
  active_inspections_growth: number;
  pending_approval: number;
  pending_approval_growth: number;
}

export const inspectorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL INSPECTORS
    getInspectors: builder.query<
      {
        success: boolean;
        data: {
          inspectors: Inspector[];
          pagination: {
            current_page: number;
            next_page: boolean;
            per_page: number;
            total: number;
          };
        };
      },
      void
    >({
      query: () => "/admin/inspectors",
      providesTags: ["Inspector"],
    }),

    // GET SINGLE INSPECTOR
    getInspectorById: builder.query<
      { success: boolean; data: InspectorDetails },
      number
    >({
      query: (id) => `/admin/inspectors/${id}`,
      providesTags: ["Inspector"],
    }),

    // STATS
    getInspectorStats: builder.query<
      { success: boolean; data: InspectorStats },
      void
    >({
      query: () => "/admin/inspector/stats",
      providesTags: ["Inspector"],
    }),

    // APPROVE
    approveInspector: builder.mutation({
      query: (id: number) => ({
        url: `/admin/inspectors/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Inspector"],
    }),

    // REJECT
    rejectInspector: builder.mutation({
      query: (id: number) => ({
        url: `/admin/inspectors/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Inspector"],
    }),

    // SUSPEND
    suspendInspector: builder.mutation({
      query: (id: number) => ({
        url: `/admin/inspectors/${id}/suspend`,
        method: "POST",
      }),
      invalidatesTags: ["Inspector"],
    }),

    // REACTIVATE
    reactivateInspector: builder.mutation({
      query: (id: number) => ({
        url: `/admin/inspectors/${id}/reactivate`,
        method: "POST",
      }),
      invalidatesTags: ["Inspector"],
    }),
  }),
});

export const {
  useGetInspectorsQuery,
  useGetInspectorByIdQuery,
  useGetInspectorStatsQuery,
  useApproveInspectorMutation,
  useRejectInspectorMutation,
  useSuspendInspectorMutation,
  useReactivateInspectorMutation,
} = inspectorApi;