import axios from "axios";

import { TOKEN_KEY, PATHS, AUTH_KEY } from "@shared/constants";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL || import.meta.env.BASE_API_URL || "http://localhost:8080/api",
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const requestUrl = config.url || "";
    
    // Для публичных эндпоинтов токен не обязателен, но если он есть - отправляем
    // Это позволяет бэкенду определить пользователя, если он авторизован
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
      const method = error?.config?.method?.toLowerCase() || "";
      const errorMessage = error?.response?.data?.error || "";
      
      // Публичные эндпоинты, которые не требуют аутентификации
      const isPublicEventsEndpoint = 
        (requestUrl === "/events" || requestUrl.startsWith("/events/")) && 
        method === "get";
      
      // Если это запрос к событиям с tab=my, но пользователь не авторизован - не удаляем токен
      // Это нормальная ситуация, когда пользователь пытается посмотреть свои события без токена
      const isMyEventsRequest = requestUrl.includes("tab=my") || requestUrl.includes("tab%3Dmy");
      
      // Для запросов к событиям (включая tab=my) не удаляем токен при 401
      // Это может быть нормальной ситуацией, если токен истек или невалиден
      if (isPublicEventsEndpoint || isMyEventsRequest) {
        // Не удаляем токен для публичных эндпоинтов или запросов к своим событиям
        // Просто игнорируем ошибку 401
        return Promise.reject(error);
      }
      
      // Для всех остальных эндпоинтов удаляем токен и перенаправляем на вход
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_KEY);
      if (window.location.pathname !== PATHS.SIGNIN && !window.location.pathname.startsWith("/events")) {
        window.location.href = PATHS.SIGNIN;
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
