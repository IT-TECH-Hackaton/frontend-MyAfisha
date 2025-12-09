import { api } from "@shared/api/instance";

export type DeleteCategoryConfig = RequestConfig<{ id: string }>;

export const deleteCategory = async ({ params, config }: DeleteCategoryConfig) => {
  const { id } = params;
  return api.delete<{ message: string }>(`admin/categories/${id}`, config);
};

