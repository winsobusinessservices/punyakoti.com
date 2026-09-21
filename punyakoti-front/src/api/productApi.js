import axiosInstance from "./axios";

export const productApi = {
  getProducts: async (categoryId = null, isAdmin = false) => {
    let params = {};
    if (categoryId) {
      params.categoryId = categoryId;
    }
    const url = isAdmin ? "/admin/products" : "/products";
    const response = await axiosInstance.get(url, { params });
    const responseData = response.data?.data || response.data;
    
    if (Array.isArray(responseData)) {
      return responseData;
    } else if (responseData?.content && Array.isArray(responseData.content)) {
      return responseData.content;
    }
    return [];
  },

  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data?.data || response.data;
  },

  createProduct: async (backendPayload, imageFiles = []) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(backendPayload)], { type: 'application/json' }));
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('files', file);
      });
    }

    const response = await axiosInstance.post("/admin/products", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data?.data || response.data;
  },

  updateProduct: async (id, backendPayload, imageFiles = []) => {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(backendPayload)], { type: 'application/json' }));
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('files', file);
      });
    }

    const response = await axiosInstance.put(
      `/admin/products/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data?.data || response.data;
  },

  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/admin/products/${id}`);
    return response.data?.data || { success: true };
  },
};

