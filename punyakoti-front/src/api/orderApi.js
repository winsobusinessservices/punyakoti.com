import axiosInstance from "./axios";

export const orderApi = {
  getOrders: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/orders?page=${page}&size=${size}`);
    const responseData = response.data?.data || response.data;
    
    // Check if it's a paginated response
    if (responseData?.content) {
      return {
        content: responseData.content,
        totalPages: responseData.totalPages || 0
      };
    }
    
    // Fallback if the backend is not paginated yet
    if (Array.isArray(responseData)) {
      return {
        content: responseData,
        totalPages: 1
      };
    }
    
    return { content: [], totalPages: 0 };
  },

  getAdminOrders: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(
      `/admin/orders?page=${page}&size=${size}`,
    );
    const responseData = response.data?.data || response.data;
    const content = responseData.content || [];
    const totalPages = responseData.totalPages || 0;
    return {
      content,
      totalPages,
    };
  },

  getOrderById: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data?.data || response.data;
  },

  updateOrderStatus: async (id, status) => {
    const backendStatus = status.toUpperCase();
    const response = await axiosInstance.put(
      `/admin/orders/${id}/status`,
      { status: backendStatus },
    );
    return response.data?.data || response.data;
  },
};
