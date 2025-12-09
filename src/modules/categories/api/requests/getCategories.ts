import { api } from "@shared/api/instance";

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetCategoriesResponse {
  data: Category[];
}

export type GetCategoriesConfig = RequestConfig;

export const getCategories = async ({ config }: GetCategoriesConfig) => {
  return api.get<GetCategoriesResponse>("categories", config);
};

