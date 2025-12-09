import { useMutation } from "@tanstack/react-query";

import type { DeleteReviewConfig } from "../requests/deleteReview";
import { deleteReview } from "../requests/deleteReview";

export const useDeleteReviewMutation = (settings?: MutationSettings<DeleteReviewConfig, typeof deleteReview>) =>
  useMutation({
    mutationKey: ["deleteReview"],
    mutationFn: ({ params, config }) =>
      deleteReview({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

