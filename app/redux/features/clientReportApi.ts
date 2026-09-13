import { baseApi } from "../api/baseApi";

export interface ClientReportClientItem {
  id: number;
  name: string;
  company_name: string;
  client_type: string;
  email: string;
  status: string;
}

export interface ClientReportItem {
  ref_no?: string;
  booking_uid?: string;
  homeowner_name?: string;
  property_address?: string;
  inspection_type?: string;
  inspector_name?: string;
  date?: string;
  status?: string;
  [key: string]: any;
}

export interface ClientReportGeneratedData {
  frequency?: string;
  period_label?: string;
  total_clients?: number;
  total_bookings?: number;
  completed_ready?: number;
  in_progress?: number;
  pending_schedule?: number;
  completion_rate?: string | number;
  client_info?: {
    name?: string;
    company_name?: string;
    client_type?: string;
    email?: string;
  };
  reports?: ClientReportItem[];
}

export interface GenerateReportQueryParams {
  client_id?: number | string;
  frequency?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface SendReportEmailBody {
  client_id?: number | string;
  frequency?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  email_override?: string;
}

export const clientReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClientReportsClientsList: builder.query<
      { success: boolean; data: ClientReportClientItem[] },
      void
    >({
      query: () => "/admin/client-reports/clients-list",
      providesTags: ["ClientReports"],
    }),

    generateClientReport: builder.query<
      { success: boolean; data: ClientReportGeneratedData },
      GenerateReportQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.client_id !== undefined && params.client_id !== "all") {
          queryParams.append("client_id", String(params.client_id));
        }
        if (params.frequency) queryParams.append("frequency", params.frequency);
        if (params.status) queryParams.append("status", params.status);
        if (params.start_date) queryParams.append("start_date", params.start_date);
        if (params.end_date) queryParams.append("end_date", params.end_date);

        return `/admin/client-reports/generate?${queryParams.toString()}`;
      },
      providesTags: ["ClientReports"],
    }),

    sendClientReportEmail: builder.mutation<
      { success: boolean; message: string },
      SendReportEmailBody
    >({
      query: (body) => ({
        url: "/admin/client-reports/send-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClientReports"],
    }),

    downloadClientReportPdf: builder.mutation<Blob, GenerateReportQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.client_id !== undefined && params.client_id !== "all") {
          queryParams.append("client_id", String(params.client_id));
        }
        if (params.frequency) queryParams.append("frequency", params.frequency);
        if (params.status) queryParams.append("status", params.status);
        if (params.start_date) queryParams.append("start_date", params.start_date);
        if (params.end_date) queryParams.append("end_date", params.end_date);

        return {
          url: `/admin/client-reports/download-pdf?${queryParams.toString()}`,
          method: "GET",
          responseHandler: async (response) => response.blob(),
        };
      },
    }),
  }),
});

export const {
  useGetClientReportsClientsListQuery,
  useGenerateClientReportQuery,
  useSendClientReportEmailMutation,
  useDownloadClientReportPdfMutation,
} = clientReportApi;
