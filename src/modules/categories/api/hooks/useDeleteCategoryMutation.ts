import { useMutation } from "@tanstack/react-query";

import type { DeleteCategoryConfig } from "../requests/deleteCategory";
import { deleteCategory } from "../requests/deleteCategory";

export const useDeleteCategoryMutation = (settings?: MutationSettings<DeleteCategoryConfig, typeof deleteCategory>) =>
  useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: ({ params, config }) =>
      deleteCategory({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

