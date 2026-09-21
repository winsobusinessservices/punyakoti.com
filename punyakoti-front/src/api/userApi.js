import axiosInstance from "./axios";

export const userApi = {
  getProfile: async () => {
    const response = await axiosInstance.get("/users/profile");
    return response.data?.data || response.data;
  },

  updateProfile: async (payload) => {
    const response = await axiosInstance.put("/users/profile", payload);
    return response.data?.data || response.data;
  },

  getAddresses: async () => {
    const response = await axiosInstance.get("/users/addresses");
    return response.data?.data || response.data;
  },

  addAddress: async (payload) => {
    const response = await axiosInstance.post("/users/addresses", payload);
    return response.data?.data || response.data;
  },

  updateAddress: async (id, payload) => {
    const response = await axiosInstance.put(`/users/addresses/${id}`, payload);
    return response.data?.data || response.data;
  },

  deleteAddress: async (id) => {
    const response = await axiosInstance.delete(`/users/addresses/${id}`);
    return response.data?.data || response.data;
  },

  getAllUsers: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(
      `/admin/users?page=${page}&size=${size}`,
    );
    const data = response.data?.data || response.data;
    if (data?.content) return data;
    if (Array.isArray(data))
      return { content: data, totalPages: 1, totalElements: data.length };
    return { content: [], totalPages: 0, totalElements: 0 };
  },

  updateUserStatus: async (userId, active) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/status`, {
      active,
    });
    return response.data?.data || response.data;
  },
};
