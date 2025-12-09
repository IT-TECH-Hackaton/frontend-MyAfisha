import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.BASE_API_URL,
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);
