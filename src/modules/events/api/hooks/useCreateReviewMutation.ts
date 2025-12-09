import { useMutation } from "@tanstack/react-query";

import type { CreateReviewConfig } from "../requests/createReview";
import { createReview } from "../requests/createReview";

export const useCreateReviewMutation = (settings?: MutationSettings<CreateReviewConfig, typeof createReview>) =>
  useMutation({
    mutationKey: ["createReview"],
    mutationFn: ({ params, config }) =>
      createReview({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

