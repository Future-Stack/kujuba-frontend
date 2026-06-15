import { baseApi } from "../api/baseApi";

// 1. Settings Type define
export interface Settings {
  id: number;
  platform_name: string;
  support_mail: string;
  max_inspector_area: number;
  inspector_response_time: number;
  urgent_booking_lead: number;
  report_deadline: number;
  platform_commission: number | string;
  auto_approve: boolean | number;
  urgent_inspection_fee: number | string;
  late_cancellation_penalty: number | string;
  last_minute_cancel_penalty: number | string;
  created_at: string;
  updated_at: string;
}

// 2. API Response type
interface SettingsResponse {
  success: boolean;
  message?: string;
  data: Settings;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET SETTINGS
    getSettings: builder.query<SettingsResponse, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),

    // UPDATE SETTINGS
    updateSettings: builder.mutation<
      SettingsResponse,
      Partial<Settings>
    >({
      query: (body) => ({
        url: "/settings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),

  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApi;