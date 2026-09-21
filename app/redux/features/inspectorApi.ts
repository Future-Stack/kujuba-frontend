/* eslint-disable @typescript-eslint/no-explicit-any */
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
  total_users: number;
  user_growth_percentage: number;
  active_users: number;
  active_growth_percentage: number;
  pending_users: number;
  pending_growth_percentage: number;
  suspended_users:number;
  suspended_growth_percentage: number;
}

export interface InspectorEarning {
  id: number;
  name: string;
  email: string;
  image: string | null;
  status: string;
  stripe_connected: boolean;
  total_earnings?: number;
  total_earnings_formatted?: string;
  total_earned?: number;
  total_earned_formatted?: string;
  paid_amount?: number;
  paid_amount_formatted?: string;
  total_paid?: number;
  total_paid_formatted?: string;
  pending_balance?: number;
  pending_balance_formatted?: string;
  total_pending?: number;
  total_pending_formatted?: string;
  payout_status?: string; // e.g. "Paid", "Pending", "Partial"
  latest_payout_status?: string;
}

export interface PayoutHistoryItem {
  id: number;
  booking_id: number;
  property_address: string;
  inspection_date: string;
  amount: number;
  amount_formatted: string;
  status: string; // "paid" | "pending"
  paid_at: string | null;
  created_at: string;
}

export const inspectorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL INSPECTORS
getInspectors: builder.query<any, { page?: number; status?: string } | void>({
  query: (params) => ({
    url: "/admin/inspectors",
    params: {
      page: params?.page ?? 1,
      ...(params?.status ? { status: params.status } : {}),
    },
  }),
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
getInspectorStats: builder.query<{ success: boolean; data: InspectorStats }, string | undefined>({
  query: (user_type) => ({
    url: "/admin/users/dashboard-stats",
    method: "GET",
    params: user_type ? { user_type } : undefined,
  }),
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

    // EARNINGS LIST
    getInspectorEarnings: builder.query<any, void>({
      query: () => ({ url: "/admin/inspectors/earnings" }),
      providesTags: ["Inspector"],
    }),

    // PAYOUT HISTORY (per inspector)
    getInspectorPayoutHistory: builder.query<any, number>({
      query: (id) => ({ url: `/admin/inspectors/${id}/payout-history` }),
      providesTags: ["Inspector"],
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
  useGetInspectorEarningsQuery,
  useGetInspectorPayoutHistoryQuery,
} = inspectorApi;