import axios from "axios";

import { TOKEN_KEY, PATHS, AUTH_KEY } from "@shared/constants";

export const api = axios.create({
  baseURL: import.meta.env.BASE_API_URL,
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const requestUrl = error?.config?.url || "";
      const isPublicEndpoint = requestUrl.includes("/events/") && error?.config?.method?.toLowerCase() === "get";
      
      if (!isPublicEndpoint) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_KEY);
        if (window.location.pathname !== PATHS.SIGNIN && !window.location.pathname.startsWith("/events/")) {
          window.location.href = PATHS.SIGNIN;
        }
      }
    }

    if (error?.response?.status === 403) {
      const errorMessage = error?.response?.data?.message || "Доступ запрещен";
      console.error("403 Forbidden:", errorMessage);
    }

    if (error?.response?.status === 404) {
      const errorMessage = error?.response?.data?.message || "Ресурс не найден";
      console.error("404 Not Found:", errorMessage);
    }

    if (error?.response?.status >= 500) {
      const errorMessage = error?.response?.data?.message || "Ошибка сервера";
      console.error("Server Error:", errorMessage);
    }

    if (!error?.response) {
      console.error("Network Error:", error.message || "Проверьте подключение к интернету");
    }

    return Promise.reject(error);
  }
);
