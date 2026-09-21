import axiosInstance from './axios';

export const authApi = {
  register: async (name, email, password, mobileNumber) => {
    const response = await axiosInstance.post('/auth/register', { name, email, password, mobileNumber });
    return response.data?.data || response.data;
  },

  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const data = response.data?.data || response.data;
    return {
      token: data.token,
      user: data.user,
      role: data.role || data.user?.role || 'CUSTOMER',
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins now
    };
  },

  googleLogin: async (token) => {
    const response = await axiosInstance.post('/auth/google', { token });
    const data = response.data?.data || response.data;
    return {
      token: data.token,
      user: data.user,
      role: data.role || data.user?.role || 'CUSTOMER',
      expiresAt: Date.now() + 15 * 60 * 1000 
    };
  },

  verifyEmail: async (token) => {
    const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
    return response.data?.data || response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data?.data || response.data;
  },

  refresh: async () => {
    const response = await axiosInstance.post('/auth/refresh', {}, { withCredentials: true });
    return response.data?.data || response.data;
  }
};
