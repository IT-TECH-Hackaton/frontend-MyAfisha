import { api } from "@shared/api/instance";

export interface CreateReviewParams {
  rating: number;
  comment?: string;
}

export interface CreateReviewResponse {
  id: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    fullName: string;
  };
  createdAt: string;
}

export type CreateReviewConfig = RequestConfig<CreateReviewParams & { id: string }>;

export const createReview = async ({ params, config }: CreateReviewConfig) => {
  const { id, ...reviewData } = params;
  return api.post<CreateReviewResponse>(`events/${id}/reviews`, reviewData, config);
};

