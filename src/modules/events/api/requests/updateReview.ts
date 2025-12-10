import { api } from "@shared/api/instance";

export interface UpdateReviewParams {
  rating: number;
  comment?: string;
}

export type UpdateReviewConfig = RequestConfig<UpdateReviewParams & { eventId: string; reviewId: string }>;

export const updateReview = async ({ params, config }: UpdateReviewConfig) => {
  const { eventId, reviewId, ...updateData } = params;
  return api.put<{ message: string }>(`events/${eventId}/reviews/${reviewId}`, updateData, config);
};

