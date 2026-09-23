// import axiosInstance from './axios';

// export const bannerApi = {
//   getBanners: async () => {
//     const response = await axiosInstance.get('/banners');
//     return response.data?.data || response.data || [];
//   },

//   createBanner: async (bannerData, imageFile) => {
//     const formData = new FormData();
//     formData.append('data', new Blob([JSON.stringify(bannerData)], { type: 'application/json' }));
//     if (imageFile) {
//       formData.append('image', imageFile);
//     }
//     const response = await axiosInstance.post('/admin/banners', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response.data?.data || response.data;
//   },

//   updateBanner: async (id, bannerData, imageFile) => {
//     const formData = new FormData();
//     formData.append('data', new Blob([JSON.stringify(bannerData)], { type: 'application/json' }));
//     if (imageFile) {
//       formData.append('image', imageFile);
//     }
//     const response = await axiosInstance.put(`/admin/banners/${id}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response.data?.data || response.data;
//   },

//   deleteBanner: async (id) => {
//     const response = await axiosInstance.delete(`/admin/banners/${id}`);
//     return response.data?.data || { success: true };
//   }
// };
