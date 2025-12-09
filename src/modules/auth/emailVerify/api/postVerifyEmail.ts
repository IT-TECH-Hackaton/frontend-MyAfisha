import { api } from "@shared/api/instance";

interface PostVerifyEmailParams {
  email: string;
  code: string;
}

export type PostVerifyEmailConfig = RequestConfig<PostVerifyEmailParams>;

export const postVerifyEmail = async ({ params, config }: PostVerifyEmailConfig) =>
  api.post<any>("auth/verify-email", params, config);

