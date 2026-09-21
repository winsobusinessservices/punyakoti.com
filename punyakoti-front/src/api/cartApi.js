import axiosInstance from './axios';

export const cartApi = {
  getCart: async () => {
    const response = await axiosInstance.get('/cart');
    return response.data?.data || response.data;
  },

  addItem: async (payload) => {
    // payload: { productId, variantId, quantity, weight }
    const response = await axiosInstance.post('/cart', payload);
    return response.data?.data || response.data;
  },

  updateQuantity: async (itemId, quantity) => {
    const response = await axiosInstance.put(`/cart/${itemId}?quantity=${quantity}`);
    return response.data?.data || response.data;
  },

  removeItem: async (itemId) => {
    const response = await axiosInstance.delete(`/cart/${itemId}`);
    return response.data?.data || response.data;
  },

  clearCart: async () => {
    const response = await axiosInstance.delete('/cart');
    return response.data?.data || response.data;
  },

  getAdminCarts: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/admin/carts?page=${page}&size=${size}`);
    const responseData = response.data?.data || response.data;
    const content = responseData.content || [];
    const totalPages = responseData.totalPages || 0;
    return {
      content,
      totalPages,
    };
  }
};
