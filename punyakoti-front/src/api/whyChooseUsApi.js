import axiosInstance from "./axios";

export const whyChooseUsApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/why-choose-us");
    const data = response.data?.data || response.data;
    if (Array.isArray(data)) return data;
    if (data?.content && Array.isArray(data.content)) return data.content;
    return [];
  },

  create: async (data, imageFile) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await axiosInstance.post('/admin/why-choose-us', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data?.data || response.data;
  },

  update: async (id, data, imageFile) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await axiosInstance.put(`/admin/why-choose-us/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data?.data || response.data;
  },

  delete: async (id) => {
    await axiosInstance.delete(`/why-choose-us/${id}`);
    return { success: true };
  },
};
