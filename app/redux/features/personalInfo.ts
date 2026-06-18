
/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../api/baseApi";


export const personalInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getUserProfile: builder.query<any, void>({
      query: () => ({
        url: "/user-profile",
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),

   
    updateUserProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/profile/update",
        method: "POST", 
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),

  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = personalInfoApi;