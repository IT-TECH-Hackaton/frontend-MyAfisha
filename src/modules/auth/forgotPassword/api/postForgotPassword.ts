import { api } from "@shared/api/instance";

interface PostForgotPasswordParams {
  email: string;
}

export type PostForgotPasswordConfig = RequestConfig<PostForgotPasswordParams>;

export const postForgotPassword = async ({ params, config }: PostForgotPasswordConfig) =>
  api.post<any>("auth/forgot-password", params, config);

