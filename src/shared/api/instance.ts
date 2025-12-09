import axios from "axios";

import { TOKEN_KEY } from "@shared/constants";

const getBaseURL = () => {
  const baseURL = import.meta.env.BASE_API_URL || import.meta.env.VITE_BASE_API_URL;
  if (baseURL) {
    return baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  }
  return "http://localhost:8081";
};

export const api = axios.create({
  baseURL: getBaseURL(),
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
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("is-auth");
      if (window.location.pathname !== "/signin") {
        window.location.href = "/signin";
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
