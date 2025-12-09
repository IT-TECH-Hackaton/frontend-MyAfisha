import { api } from "@shared/api/instance";

export interface CreateReviewParams {
  rating: number;
  comment: string;
}

export type CreateReviewConfig = RequestConfig<CreateReviewParams & { id: string }>;

export const createReview = async ({ params, config }: CreateReviewConfig) => {
  const { id, ...reviewData } = params;
  return api.post<{ message: string; review: any }>(`events/${id}/reviews`, reviewData, config);
};

