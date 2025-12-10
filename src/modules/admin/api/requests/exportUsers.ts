import { api } from "@shared/api/instance";

export interface ExportUsersParams {
  format?: "csv" | "xlsx";
  fullName?: string;
  role?: "Пользователь" | "Администратор";
  status?: "Активен" | "Удален";
  dateFrom?: string;
  dateTo?: string;
}

export type ExportUsersConfig = RequestConfig<ExportUsersParams>;

export const exportUsers = async ({ params, config }: ExportUsersConfig) => {
  const { format = "xlsx", ...filters } = params || {};
  const response = await api.get<Blob>("admin/users/export", {
    params: { format, ...filters },
    responseType: "blob",
    ...config
  });
  return response;
};

