import axiosInstance from "./axios";

export const contactApi = {
  submitContact: async (data) => {
    const response = await axiosInstance.post("/contact", data);
    return response.data?.data || response.data;
  },

  getAdminContacts: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(
      `/admin/contact?page=${page}&size=${size}`,
    );
    const responseData = response.data?.data || response.data;
    const content = responseData.content || [];
    const totalPages = responseData.totalPages || 0;
    return {
      content,
      totalPages,
    };
  },

  resolveContact: async (id) => {
    const response = await axiosInstance.put(`/admin/contact/${id}/resolve`);
    return response.data?.data || response.data;
  },

  deleteContact: async (id) => {
    const response = await axiosInstance.delete(`/admin/contact/${id}`);
    return response.data?.data || response.data;
  },
};
