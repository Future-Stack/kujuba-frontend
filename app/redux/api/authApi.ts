

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

forgotPassword: builder.mutation({
  query: (body) => ({
    url: "/forgot-password",
    method: "POST",
    body,
  }),
}),

verifyOtp: builder.mutation({
  query: (body) => ({
    url: "/verify-otp",
    method: "POST",
    body,
  }),
}),

resendOtp: builder.mutation({
  query: (body) => ({
    url: "/resend-otp",
    method: "POST",
    body,
  }),
}),

resetPassword: builder.mutation({
  query: (body) => ({
    url: "/reset-password",
    method: "POST",
    body,
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

export const { useLoginMutation, useChangePasswordMutation,useGoogleLoginMutation, useForgotPasswordMutation, useVerifyOtpMutation,useResendOtpMutation,useResetPasswordMutation ,useLogoutMutation } = authApi;