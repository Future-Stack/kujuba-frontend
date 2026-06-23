/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../api/baseApi";


export interface BookingDetails {
  booking_id: number;
  inspection_title: string;
  status: string;
  assign_status:string;
  urgent_status: number;
  scheduled_date: string;
  scheduled_time: string;
  note: string;

  homeowner: {
    name: string;
    email: string;
    phone: string | null;
    address: string;
    property_type: string;
    property_size: string;
  };

  inspector: {
    name: string;
    email: string;
    phone: string;
    address: string;
    profile_img: string | null;
    license_number: string;
    license_expiry: string | null;
    insurance_expiry: string | null;
    stripe_account_id: string | null;
    stripe_customer_id: string | null;
    onboarding_completed: boolean;
    earnings: string;
    inspection_types: string[];
    assigned_on: string;
  };

  payment: {
    inspection_fee: string;
    urgent_fee: string;
    platform_commission: string;
    inspector_payout: string;
    method: string;
    status: string;
    paid_on: string;
  };

  report: any;
  reschedule_history: any;
  timeline: {
    event: string;
    timestamp: string | null;
  }[];
}

/* ---- Suspend Inspector ---- */

export interface SuspendInspectorResponse {
  success: boolean;
  message: string;
  inspector: {
    id: number;
    first_name: string;
    last_name: string;
    status: "active" | "suspended";
  };
}



export const inspectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({



    getInspectionMetrics: builder.query<any, void>({
      query: () => "/admin/inspection-metrics",
      providesTags: ["InspectionType"],
    }),

    getInspectionManagement: builder.query<any, string>({
      query: (filter) => `/admin/inspection-management?status=${filter}`,
      providesTags: ["InspectionType"],
    }),

    assignInspection: builder.mutation<any, any>({
      query: (body) => ({
        url: "/assign-Inspection",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InspectionType"],
    }),

    getAvailableInspectors: builder.query<any, void>({
      query: () => "/admin/available-inspectors",
      providesTags: ["Inspection"],
    }),

    getExportInspections: builder.query<any, void>({
      query: () => "/admin/export-inspections-data",
      providesTags: ["InspectionType"],
    }),

   

    getBookingDetails: builder.query<
      { success: boolean; data: BookingDetails },
      number
    >({
      query: (id) => `/admin/booking-details/${id}`,
      providesTags: ["Inspection"],
    }),


    suspendInspector: builder.mutation<
      SuspendInspectorResponse,
      number
    >({
      query: (id) => ({
        url: `/admin/suspend-inspector/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Inspection"],
    }),

 

    markInspectionComplete: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/admin/mark-inspection-complete/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Inspection"],
    }),

  }),
});



export const {
  useGetInspectionMetricsQuery,
  useGetInspectionManagementQuery,
  useAssignInspectionMutation,
  useGetAvailableInspectorsQuery,
  useGetExportInspectionsQuery,

  useGetBookingDetailsQuery,
  useSuspendInspectorMutation,
  useMarkInspectionCompleteMutation,
} = inspectionApi;