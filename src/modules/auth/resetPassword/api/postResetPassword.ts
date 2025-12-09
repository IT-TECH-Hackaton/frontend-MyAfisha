import { api } from "@shared/api/instance";

interface PostResetPasswordParams {
  token: string;
  password: string;
}

export type PostResetPasswordConfig = RequestConfig<PostResetPasswordParams>;

export const postResetPassword = async ({ params, config }: PostResetPasswordConfig) =>
  api.post<any>("auth/reset-password", params, config);

