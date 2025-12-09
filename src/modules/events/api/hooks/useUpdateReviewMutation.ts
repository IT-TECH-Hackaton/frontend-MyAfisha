import { useMutation } from "@tanstack/react-query";

import type { UpdateReviewConfig } from "../requests/updateReview";
import { updateReview } from "../requests/updateReview";

export const useUpdateReviewMutation = (settings?: MutationSettings<UpdateReviewConfig, typeof updateReview>) =>
  useMutation({
    mutationKey: ["updateReview"],
    mutationFn: ({ params, config }) =>
      updateReview({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

