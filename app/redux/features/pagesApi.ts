

import { baseApi } from "../api/baseApi";

/* ================= TYPES ================= */
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string | number;
  created_at: string;
  updated_at: string;
}

interface PagesResponse {
  success: boolean;
  data: Page[] | Page;
  message?: string;
}


export const pagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL PAGES
    getPages: builder.query<PagesResponse, void>({
      query: () => "/pages",
      providesTags: ["Pages"],
    }),

    // GET SINGLE PAGE (optional but useful)
    getSinglePage: builder.query<Page, number>({
      query: (id) => `/pages/${id}`,
      providesTags: ["Pages"],
    }),

    // CREATE PAGE
    createPage: builder.mutation<PagesResponse, Partial<Page>>({
      query: (body) => ({
        url: "/pages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Pages"],
    }),

    // UPDATE PAGE
    updatePage: builder.mutation<
      PagesResponse,
      { id: number; body: Partial<Page> }
    >({
      query: ({ id, body }) => ({
        url: `/pages/${id}`,
        method: "PATCH", // Laravel often uses POST for update
        body,
      }),
      invalidatesTags: ["Pages"],
    }),

    // DELETE PAGE
    deletePage: builder.mutation<PagesResponse, number>({
      query: (id) => ({
        url: `/pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pages"],
    }),
  }),
});

/* ================= EXPORT HOOKS ================= */
export const {
  useGetPagesQuery,
  useGetSinglePageQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pagesApi;