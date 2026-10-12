import baseApi from "./baseApi";
import { patchAssessmentPayload } from "@/lib/assessmentPatch";

const assessmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAssessments: builder.query({
      query: () => ({
        url: `/admin/assessment`,
        method: "GET",
      }),
      providesTags: ["assessment"],
    }),

    getAssessmentById: builder.query({
      query: (id: string) => ({
        url: `/admin/assessment/${id}`,
        method: "GET",
      }),
      // The deployed API returns { success, message, data: { questions, groups } }
      // but the frontend expects .result – normalize here and apply question patches.
      transformResponse: (response: any) => {
        const payload = response?.result ?? response?.data ?? response;
        const patched = patchAssessmentPayload(payload);
        return { ...response, result: patched };
      },
      providesTags: ["assessment"],
    }),

    getQuestionsByType: builder.query({
      query: (type: string) => ({
        url: `/admin/questions-by-type?questionType=${type}`,
        method: "GET",
      }),
      providesTags: ["assessment"],
    }),

    submitPRForm: builder.mutation({
      query: (data) => ({
        url: "/admin/assessment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["assessment"],
    }),
    
    submitAssesment: builder.mutation({
      query: (data) => ({
        url: "/submit-assessment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["assessment"],
    }),
  }),
});

export const {
  useGetAllAssessmentsQuery,
  useGetAssessmentByIdQuery,
  useGetQuestionsByTypeQuery,
  useSubmitPRFormMutation,
  useSubmitAssesmentMutation,
} = assessmentApi;
