

import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
      
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation({
  query: (body) => ({
    url: "/change-password",
    method: "POST",
    body,
  }),
}),

googleLogin: builder.mutation({
  query: (id_token: string) => ({
    url: "/google-token",
    method: "POST",
    body: {
      id_token,
    },
  }),
}),

logout: builder.mutation<void, void>({
  query: () => ({
    url: "/logout",
    method: "POST",
  }),
}),
  }),
});

export const { useLoginMutation, useChangePasswordMutation,useGoogleLoginMutation ,useLogoutMutation } = authApi;