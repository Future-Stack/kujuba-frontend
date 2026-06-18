import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.connecttoinspect.com/api/v1",

    prepareHeaders: (headers, { endpoint }) => {
      
      const token = typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

      const publicEndpoints = ["getInspectionTypes", "getInspectionTypeById"];

      if (token && !publicEndpoints.includes(endpoint)) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["User", "Inspection", "Support", "Faq", "Settings", "Pages", "Reviews","Reports","Notifications", "UserProfile", "Users","Inspector"],
  endpoints: () => ({}),
});



// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseApi = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//      baseUrl: process.env.NEXT_PUBLIC_API_URL,
     

//    prepareHeaders: (headers, { endpoint }) => {
//   const token = localStorage.getItem("access_token");

  
//   const publicEndpoints = ["getInspectionTypes", "getInspectionTypeById"];

//   if (token && !publicEndpoints.includes(endpoint)) {
//     headers.set("authorization", `Bearer ${token}`);
//   }

//   return headers;
// },
//   }),

//   tagTypes: ["User","Inspection", "Support","Faq", "Settings","Pages","Reviews"],
//   endpoints: () => ({}),
// });