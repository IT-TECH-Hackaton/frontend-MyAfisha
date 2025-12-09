import { api } from "@shared/api/instance";

export interface CreateCategoryParams {
  name: string;
  description?: string;
}

export interface CreateCategoryResponse {
  message: string;
  category: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
  };
}

export type CreateCategoryConfig = RequestConfig<CreateCategoryParams>;

export const createCategory = async ({ params, config }: CreateCategoryConfig) => {
  return api.post<CreateCategoryResponse>("admin/categories", params, config);
};

