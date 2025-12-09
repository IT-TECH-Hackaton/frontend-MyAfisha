import { api } from "@shared/api/instance";

export const postLogout = async ({ config }: RequestConfig) => api.post("auth/logout", {}, config);
