import { api } from "@shared/api/instance";

export interface UpdateCategoryParams {
  id: string;
  name?: string;
  description?: string;
}

export interface UpdateCategoryResponse {
  message: string;
  category: {
    id: string;
    name: string;
    description?: string;
    updatedAt: string;
  };
}

export type UpdateCategoryConfig = RequestConfig<UpdateCategoryParams>;

export const updateCategory = async ({ params, config }: UpdateCategoryConfig) => {
  const { id, ...updateData } = params;
  return api.put<UpdateCategoryResponse>(`admin/categories/${id}`, updateData, config);
};

