import axios from "axios";

const baseUrl = "http://petmarket.runasp.net";

const api = axios.create({
  baseURL: baseUrl,
});

// Interceptor للتعامل مع انتهاء التوكن
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.get(`${baseUrl}/api/Account/refreshToken`, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });

        localStorage.setItem("token", data.token);
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (err) {
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
