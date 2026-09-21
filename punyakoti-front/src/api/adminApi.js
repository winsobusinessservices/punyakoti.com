import axiosInstance from './axios';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard/stats');
    return response.data?.data || response.data;
  }
};
