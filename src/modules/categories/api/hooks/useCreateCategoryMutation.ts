import { useMutation } from "@tanstack/react-query";

import type { CreateCategoryConfig } from "../requests/createCategory";
import { createCategory } from "../requests/createCategory";

export const useCreateCategoryMutation = (settings?: MutationSettings<CreateCategoryConfig, typeof createCategory>) =>
  useMutation({
    mutationKey: ["createCategory"],
    mutationFn: ({ params, config }) =>
      createCategory({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

