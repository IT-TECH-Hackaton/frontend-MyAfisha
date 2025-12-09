import { api } from "@shared/api/instance";

interface PostOAuthCallbackParams {
  provider: "yandex" | "vk";
  code: string;
  state?: string;
}

export type PostOAuthCallbackConfig = RequestConfig<PostOAuthCallbackParams>;

export const postOAuthCallback = async ({ params, config }: PostOAuthCallbackConfig) =>
  api.post<any>("auth/oauth/callback", params, config);

