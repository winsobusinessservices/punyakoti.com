import axiosInstance from './axios';

export const howItWorksApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/how-it-works');
    return response.data?.data || response.data;
  },

  create: async (data, imageFile) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await axiosInstance.post('/admin/how-it-works', formData, {
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
    const response = await axiosInstance.put(`/admin/how-it-works/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data?.data || response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/admin/how-it-works/${id}`);
    return response.data?.data || response.data;
  }
};
