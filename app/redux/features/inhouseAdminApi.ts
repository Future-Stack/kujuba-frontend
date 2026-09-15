/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../api/baseApi";

export const inhouseAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInhouseAdmins: builder.query<
      any,
      { search?: string; status?: string; page?: number; per_page?: number } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status && params.status !== "all") queryParams.append("status", params.status);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.per_page) queryParams.append("per_page", params.per_page.toString());

        return {
          url: `/admin/inhouse-admins?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["InhouseAdmins"],
    }),

    getInhouseAdminStats: builder.query<any, void>({
      query: () => ({
        url: "/admin/inhouse-admins/stats",
        method: "GET",
      }),
      providesTags: ["InhouseAdmins"],
    }),

    getAvailablePermissions: builder.query<any, void>({
      query: () => ({
        url: "/admin/inhouse-admins/available-permissions",
        method: "GET",
      }),
    }),

    createInhouseAdmin: builder.mutation<any, FormData | any>({
      query: (body) => ({
        url: "/admin/inhouse-admins",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InhouseAdmins"],
    }),

    suspendInhouseAdmin: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/admin/inhouse-admins/${id}/suspend`,
        method: "POST",
      }),
      invalidatesTags: ["InhouseAdmins"],
    }),

    unsuspendInhouseAdmin: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `/admin/inhouse-admins/${id}/unsuspend`,
        method: "POST",
      }),
      invalidatesTags: ["InhouseAdmins"],
    }),

    assignPermissions: builder.mutation<any, { id: number | string; body: FormData | any }>({
      query: ({ id, body }) => ({
        url: `/admin/inhouse-admins/${id}/assign-permissions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["InhouseAdmins"],
    }),
  }),
});

export const {
  useGetInhouseAdminsQuery,
  useGetInhouseAdminStatsQuery,
  useGetAvailablePermissionsQuery,
  useCreateInhouseAdminMutation,
  useSuspendInhouseAdminMutation,
  useUnsuspendInhouseAdminMutation,
  useAssignPermissionsMutation,
} = inhouseAdminApi;
