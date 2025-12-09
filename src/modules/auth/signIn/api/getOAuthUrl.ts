import { api } from "@shared/api/instance";

interface GetOAuthUrlParams {
  provider: "yandex" | "vk";
}

export type GetOAuthUrlConfig = RequestConfig<GetOAuthUrlParams>;

export const getOAuthUrl = async ({ params, config }: GetOAuthUrlConfig) =>
  api.get<{ url: string }>(`auth/oauth/${params.provider}/url`, config);

