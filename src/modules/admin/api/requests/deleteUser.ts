import { api } from "@shared/api/instance";

export type DeleteUserConfig = RequestConfig<{ id: string }>;

export const deleteUser = async ({ params, config }: DeleteUserConfig) =>
  api.delete<{ message: string }>(`admin/users/${params.id}`, config);

