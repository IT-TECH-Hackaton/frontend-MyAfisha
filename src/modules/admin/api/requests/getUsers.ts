import { api } from "@shared/api/instance";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  fullName?: string;
  role?: "Пользователь" | "Администратор";
  status?: "Активен" | "Удален";
  dateFrom?: string;
  dateTo?: string;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: "Пользователь" | "Администратор";
  status: "Активен" | "Удален";
  createdAt: string;
}

export interface UsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetUsersResponse {
  data: UserResponse[];
  pagination: UsersPagination;
}

export type GetUsersConfig = RequestConfig<GetUsersParams>;

export const getUsers = async ({ params, config }: GetUsersConfig) => {
  const queryParams: Record<string, string | number> = {};
  
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.fullName) queryParams.fullName = params.fullName;
  if (params?.role) queryParams.role = params.role;
  if (params?.status) queryParams.status = params.status;
  if (params?.dateFrom) queryParams.dateFrom = params.dateFrom;
  if (params?.dateTo) queryParams.dateTo = params.dateTo;

  return api.get<GetUsersResponse>("admin/users", {
    params: queryParams,
    ...config
  });
};

