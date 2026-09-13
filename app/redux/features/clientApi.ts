import { baseApi } from "../api/baseApi";

export interface ClientType {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  company_name: string;
  client_type: "insurance_company" | "realtor" | "broker" | "agency" | string;
  phone: string;
  address: string;
  image?: string | null;
  status: "active" | "suspended" | "pending" | string;
  user_type?: string;
  total_inspections?: number;
  completed_inspections?: number;
  pending_inspections?: number;
  in_progress_inspections?: number;
  cancelled_inspections?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClientStatsData {
  total_clients: number;
  client_growth_percentage: number;
  active_clients: number;
  active_growth_percentage: number;
  pending_clients: number;
  pending_growth_percentage: number;
  suspended_clients: number;
  suspended_growth_percentage: number;
  total_client_inspections: number;
  completed_client_inspections: number;
  client_type_breakdown?: Array<{ type: string; count: number }>;
}

export interface ClientStatsResponse {
  success: boolean;
  data: ClientStatsData;
}

export interface ClientsResponse {
  success: boolean;
  data: ClientType[] | { data: ClientType[]; pagination?: any };
  message?: string;
}

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientStats: builder.query<ClientStatsResponse, void>({
      query: () => "/admin/clients/stats",
      providesTags: ["Clients"],
    }),

    getClients: builder.query<ClientsResponse, void>({
      query: () => "/admin/clients",
      providesTags: ["Clients"],
    }),

    createClient: builder.mutation<
      { success: boolean; message: string; data: ClientType },
      FormData
    >({
      query: (formData) => ({
        url: "/admin/clients",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Clients"],
    }),

    suspendClient: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/clients/${id}/suspend`,
        method: "POST",
      }),
      invalidatesTags: ["Clients"],
    }),

    unsuspendClient: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/clients/${id}/unsuspend`,
        method: "POST",
      }),
      invalidatesTags: ["Clients"],
    }),

    deleteClient: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),

    linkBookings: builder.mutation<
      { success: boolean; message: string },
      { id: number; booking_ids: number[] }
    >({
      query: ({ id, booking_ids }) => ({
        url: `/admin/clients/${id}/link-bookings`,
        method: "POST",
        body: { booking_ids },
      }),
      invalidatesTags: ["Clients", "Inspection"],
    }),
  }),
});

export const {
  useGetClientStatsQuery,
  useGetClientsQuery,
  useCreateClientMutation,
  useSuspendClientMutation,
  useUnsuspendClientMutation,
  useDeleteClientMutation,
  useLinkBookingsMutation,
} = clientApi;
