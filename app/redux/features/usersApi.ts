import { baseApi } from "../api/baseApi";


export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getUsers: builder.query({
      query: (user_type?: string) => ({
        url: "/admin/users",
        method: "GET",
        params: user_type ? { user_type } : undefined,
      }),
      providesTags: ["Users"],
    }),

    createUser: builder.mutation({
      query: (formData: FormData) => ({
        url: "/admin/users",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users", "Inspector"],
    }),


    getUserById: builder.query({
      query: ({ id, user_type }: { id: number; user_type?: string }) => ({
        url: `/admin/users/${id}`,
        method: "GET",
        params: user_type ? { user_type } : undefined,
      }),
      providesTags: (_result, _error, arg) => [
        { type: "Users", id: arg.id },
      ],
    }),


    suspendUser: builder.mutation({
      query: (id: number) => ({
        url: `/admin/users/${id}/suspend`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id: number) => ({
        url: `/admin/users/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Inspector"],
    }),

    unsuspendUser: builder.mutation({
      query: (id: number) => ({
        url: `/admin/users/${id}/unsuspend`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

     getUserDashboardStats: builder.query({
      query: (user_type?: string) => ({
        url: "/admin/users/dashboard-stats",
        method: "GET",
        params: user_type ? { user_type } : undefined, 
      }),
      providesTags: ["Users"],
    }),
  }),
});

// export hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useSuspendUserMutation,
  useDeleteUserMutation,
  useUnsuspendUserMutation,
  useGetUserDashboardStatsQuery
} = usersApi;