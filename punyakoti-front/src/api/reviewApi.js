import axiosInstance from "./axios";

export const reviewApi = {
  getReviews: async (isAdmin = false) => {
    const url = isAdmin ? "/admin/reviews" : "/reviews";
    const response = await axiosInstance.get(url);
    const responseData = response.data?.data || response.data;
    
    if (Array.isArray(responseData)) {
      return responseData;
    } else if (responseData?.content && Array.isArray(responseData.content)) {
      return responseData.content;
    }
    return [];
  },

  createReview: async (backendPayload, videoFile) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(backendPayload)], { type: 'application/json' }));
    if (videoFile) {
      formData.append('video', videoFile);
    }

    const response = await axiosInstance.post("/reviews", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data?.data || response.data;
  },

  approveReview: async (id) => {
    const response = await axiosInstance.put(`/admin/reviews/${id}/approve`);
    return response.data?.data || { success: true };
  },

  deleteReview: async (id) => {
    const response = await axiosInstance.delete(`/admin/reviews/${id}`);
    return response.data?.data || { success: true };
  },
};
