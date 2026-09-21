import axiosInstance from "./axios";

export const faqApi = {
  getFaqs: async () => {
    const response = await axiosInstance.get("/faqs");
    const data = response.data?.data.length ? response.data?.data : response.data;
    if (Array.isArray(data)) return data;
    if (data?.content && Array.isArray(data.content)) return data.content;
    return [];
  },

  createFaq: async (faqData) => {
    const response = await axiosInstance.post("/admin/faqs", faqData);
    return response.data?.data || response.data;
  },

  updateFaq: async (id, faqData) => {
    const response = await axiosInstance.put(`/admin/faqs/${id}`, faqData);
    return response.data?.data || response.data;
  },

  deleteFaq: async (id) => {
    const response = await axiosInstance.delete(`/admin/faqs/${id}`);
    return response.data?.data || { success: true };
  },
};
