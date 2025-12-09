import { api } from "@shared/api/instance";

export interface UpdateUserParams {
  fullName?: string;
  role?: "Пользователь" | "Администратор";
  status?: "Активен" | "Удален";
}

export type UpdateUserConfig = RequestConfig<UpdateUserParams & { id: string }>;

export const updateUser = async ({ params, config }: UpdateUserConfig) => {
  const { id, ...updateData } = params;
  return api.put<{ message: string }>(`admin/users/${id}`, updateData, config);
};

