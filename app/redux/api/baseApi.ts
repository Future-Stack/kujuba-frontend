// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// export const baseApi = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.connecttoinspect.com/api/v1",

//     prepareHeaders: (headers, { endpoint }) => {
      
//       const token = typeof window !== "undefined"
//         ? localStorage.getItem("access_token")
//         : null;

//       const publicEndpoints = ["getInspectionTypes", "getInspectionTypeById"];

//       if (token && !publicEndpoints.includes(endpoint)) {
//         headers.set("authorization", `Bearer ${token}`);
//       }

//       return headers;
//     },
//   }),

  

//   tagTypes: ["User", "Inspection", "Support", "Faq", "Settings", "InspectionType", "Pages", "Reviews","Reports","Notifications", "UserProfile", "Users","Inspector", "Overview", "Payments","notifications"],
//   endpoints: () => ({}),
// });

import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

// ── Step 1: base query ──
const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.connecttoinspect.com/api/v1",
  prepareHeaders: (headers, { endpoint }) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const publicEndpoints = ["getInspectionTypes", "getInspectionTypeById"];

    if (token && !publicEndpoints.includes(endpoint)) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// ── Step 2: refresh token wrapper ──
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refresh_token")
        : null;

    if (refreshToken) {
      try {
        const refreshResult = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL ||
            "https://api.connecttoinspect.com/api/v1"
          }/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          }
        );

        if (refreshResult.ok) {
          const data = (await refreshResult.json()) as {
            access_token: string;
            refresh_token?: string;
          };

          localStorage.setItem("access_token", data.access_token);
          if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
          }

          // retry original request with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // refresh failed → force logout
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } catch {
        // network error on refresh → force logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    } else {
      // no refresh token → force logout
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
  }

  return result;
};

// ── Step 3: create API ──
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Inspection",
    "Support",
    "Faq",
    "Settings",
    "InspectionType",
    "Pages",
    "Reviews",
    "Reports",
    "Notifications",
    "UserProfile",
    "Users",
    "Inspector",
    "Overview",
    "Payments",
    "notifications",
  ],
  endpoints: () => ({}),
});