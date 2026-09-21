import axiosInstance from './axios';

export const categoryApi = {
  getCategories: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data?.data || response.data || [];
  },

  createCategory: async (categoryData, imageFile) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(categoryData)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await axiosInstance.post('/admin/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data?.data || response.data;
  },

  updateCategory: async (id, categoryData, imageFile) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(categoryData)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const response = await axiosInstance.put(`/admin/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data?.data || response.data;
  },

  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/admin/categories/${id}`);
    return response.data?.data || { success: true };
  }
};
