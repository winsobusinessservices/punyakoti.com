import axiosInstance from './axios';

export const paymentApi = {
  createOrder: async (addressId, paymentMethod = 'ONLINE') => {
    const response = await axiosInstance.post('/orders', { addressId, paymentMethod });
    return response.data?.data || response.data;
  },
  verifyPayment: async (localOrderId, razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const response = await axiosInstance.post(`/orders/${localOrderId}/verify`, {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    return response.data?.data || response.data;
  }
};
