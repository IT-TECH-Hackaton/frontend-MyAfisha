import { api } from "@shared/api/instance";

export interface Interest {
  id: string;
  name: string;
  description?: string;
}

export interface GetInterestsResponse {
  data: Interest[];
}

export type GetInterestsConfig = RequestConfig;

export const getInterests = async ({ config }: GetInterestsConfig) => {
  return api.get<GetInterestsResponse>("interests", config);
};

