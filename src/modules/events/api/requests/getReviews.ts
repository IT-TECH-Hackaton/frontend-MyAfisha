import { api } from "@shared/api/instance";

export interface ReviewResponse {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetReviewsResponse {
  data: ReviewResponse[];
  averageRating: number;
  totalReviews: number;
}

export type GetReviewsConfig = RequestConfig<{ id: string }>;

export const getReviews = async ({ params, config }: GetReviewsConfig) =>
  api.get<GetReviewsResponse>(`events/${params.id}/reviews`, config);

