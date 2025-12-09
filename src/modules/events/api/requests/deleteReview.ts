import { api } from "@shared/api/instance";

export type DeleteReviewConfig = RequestConfig<{ eventId: string; reviewId: string }>;

export const deleteReview = async ({ params, config }: DeleteReviewConfig) =>
  api.delete<{ message: string }>(`events/${params.eventId}/reviews/${params.reviewId}`, config);

