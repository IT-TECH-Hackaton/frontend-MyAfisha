import { api } from "@shared/api/instance";

interface GetOAuthUrlParams {
  provider: "yandex" | "vk";
  redirect_uri?: string;
}

export type GetOAuthUrlConfig = RequestConfig<GetOAuthUrlParams>;

export const getOAuthUrl = async ({ params, config }: GetOAuthUrlConfig) => {
  if (params.provider === "yandex") {
    return api.get<{ authUrl: string; state: string } | { fake: boolean; message: string }>(
      "auth/yandex",
      {
        ...config,
        params: params.redirect_uri ? { redirect_uri: params.redirect_uri } : undefined
      }
    );
  }
  throw new Error(`OAuth provider ${params.provider} not supported`);
};

