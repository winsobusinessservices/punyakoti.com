import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach JWT Token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("punyakoti_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Global Error Handler
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    let customError = {
      message: "Something went wrong",
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };

    if (error.response) {
      const url = originalRequest.url || "";
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        !url.includes("/auth/refresh") &&
        !url.includes("/auth/login") &&
        !url.includes("/auth/verify-otp")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          );
          const newAccessToken = data.data.accessToken;
          localStorage.setItem("punyakoti_token", newAccessToken);
          // Update the expiration time to match the new token (e.g., +15 mins)
          localStorage.setItem(
            "punyakoti_expiresAt",
            (Date.now() + 15 * 60 * 1000).toString(),
          );
          axiosInstance.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem("punyakoti_token");
          // Optionally emit event or redirect
          window.location.href = "/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      if (error.response.status === 401) {
        customError.message = "Unauthorized! Please login again.";
      } else if (error.response.status === 403) {
        customError.message =
          "Forbidden! You do not have access to this resource.";
      } else if (error.response.status === 404) {
        customError.message = "Requested resource not found.";
      } else if (error.response.data?.message) {
        customError.message = error.response.data.message;
      }
    } else if (error.request) {
      // Request was made but no response received
      customError.message =
        "No response received from the server. Please check your connection.";
    } else {
      // Something happened in setting up the request
      customError.message = error.message;
    }

    return Promise.reject(customError);
  },
);

export default axiosInstance;
