import { baseApi } from "../api/baseApi";


export interface PaymentBooking {
  id: number;
  property_address: string;
  property_type: string;
  property_size: string;
  scheduled_date: string;
  scheduled_time: string;
}

export interface PaymentItem {
  id: number;
  inspection_booking_id: number;

  subtotal: number;
  platform_fee: number;
  urgent_fee: number;
  inspector_share: number;
  admin_share: number;
  total: number;

  payment_type: "inspection_fee" | "refund" | "paycut";
  trx_id: string;

  status: "paid" | "pending" | "failed";
  urgentStatus: string | number;

  is_disbursed: boolean;

  created_at: string;
  updated_at: string;

  inspection_booking: {
    id: number;
    property_address: string;
    property_type: string;
    property_size: string;
    scheduled_date: string;
    scheduled_time: string;

    homeowner: {
      first_name: string;
      last_name: string;
      email: string;
    };

    inspection_assign: {
      status: string;
      inspector?: {
        first_name: string;
        last_name: string;
      };
    } | null;
  };
}

export interface PaymentListResponse {
  current_page: number;
  data: PaymentItem[];
  total: number;
  per_page: number;
}

export interface PaymentExportRow {
  transaction_id: string;
  payment_type: string;
  status: string;
  total_amount: string;
  inspector_share: string;
  admin_share: string;
  urgent_fee: string;
  platform_fee: string;
  booking_id: number;
  inspector_name: string;
  homeowner_name: string;
  created_date: string;
}

export interface PaymentMetrics {
  total_revenue: string;
  completed_payouts: number;
  pending_payouts: number;
  total_refunded: number;
  growth_rate: number;
}

export interface PaymentMetricsResponse {
  success: boolean;
  data: PaymentMetrics;
}



export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getPayments: builder.query<
      PaymentListResponse,
      {
        status?: string;
        payment_type?: string;
        search?: string;
      }
    >({
      query: (params) => ({
        url: "/admin/payment-list",
        params,
      }),
      providesTags: ["Payments"],
    }),

   getPaymentMetrics: builder.query<
      PaymentMetricsResponse,
      void
    >({
      query: () => "/admin/payment-matrics",
      providesTags: ["Payments"],
    }),

    exportPayments: builder.query<PaymentExportRow[], void>({
      query: () => "/admin/export-payments-data",
    }),

    exportSinglePayment: builder.query<
      PaymentExportRow,
      number
    >({
      query: (id) => `/admin/export-single-payments-data/${id}`,
    }),
  }),
});



export const {
  useGetPaymentsQuery,
  useGetPaymentMetricsQuery,
  useExportPaymentsQuery,
  useExportSinglePaymentQuery,
} = paymentApi;