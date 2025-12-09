import { api } from "@shared/api/instance";

interface PostResendCodeParams {
  email: string;
}

export type PostResendCodeConfig = RequestConfig<PostResendCodeParams>;

export const postResendCode = async ({ params, config }: PostResendCodeConfig) =>
  api.post<any>("auth/resend-code", params, config);

