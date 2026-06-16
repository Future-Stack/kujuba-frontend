
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
     baseUrl: process.env.NEXT_PUBLIC_API_URL,
     

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");

      return headers;
    },
  }),

  tagTypes: ["User","Inspection", "Support","Faq", "Settings","Pages","Reviews"],
  endpoints: () => ({}),
});