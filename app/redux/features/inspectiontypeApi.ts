/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../api/baseApi";


export const inspectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
     // GET
  getInspectionTypes: builder.query<any, void>({
  query: () => "/inspection-types",
  providesTags: ["Inspection"],
}),


    // ADD (CREATE)
    addInspectionType: builder.mutation({
      query: (formData: FormData) => ({
        url: "/inspection-types",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Inspection"],
    }),
    updateInspectionType: builder.mutation({
  query: ({ id, formData }) => ({
    url: `/inspection-types/${id}`,
    method: "POST", 
    body: formData,
  }),
  invalidatesTags: ["Inspection"],
}),

        deleteInspectionType: builder.mutation({
      query: (id: number) => ({
        url: `/inspection-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inspection"],
    }),
  }),
});

export const { useGetInspectionTypesQuery, useAddInspectionTypeMutation, useUpdateInspectionTypeMutation, useDeleteInspectionTypeMutation } = inspectionApi;