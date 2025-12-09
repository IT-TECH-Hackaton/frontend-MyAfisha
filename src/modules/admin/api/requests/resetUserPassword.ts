import { api } from "@shared/api/instance";

export interface ResetUserPasswordParams {
  password: string;
}

export type ResetUserPasswordConfig = RequestConfig<ResetUserPasswordParams & { id: string }>;

export const resetUserPassword = async ({ params, config }: ResetUserPasswordConfig) => {
  const { id, password } = params;
  return api.post<{ message: string }>(`admin/users/${id}/reset-password`, { password }, config);
};

