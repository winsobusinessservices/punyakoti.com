import axiosInstance from './axios';

export const howItWorksApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/how-it-works');
    return response.data?.data || response.data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/admin/how-it-works', data);
    return response.data?.data || response.data;
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/admin/how-it-works/${id}`, data);
    return response.data?.data || response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/admin/how-it-works/${id}`);
    return response.data?.data || response.data;
  }
};
