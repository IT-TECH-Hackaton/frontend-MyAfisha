import { useMutation } from "@tanstack/react-query";

import type { UpdateCategoryConfig } from "../requests/updateCategory";
import { updateCategory } from "../requests/updateCategory";

export const useUpdateCategoryMutation = (settings?: MutationSettings<UpdateCategoryConfig, typeof updateCategory>) =>
  useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: ({ params, config }) =>
      updateCategory({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

