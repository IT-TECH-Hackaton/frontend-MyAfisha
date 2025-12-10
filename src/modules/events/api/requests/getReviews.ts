import { api } from "@shared/api/instance";

export interface ReviewResponse {
  id: string;
  eventID: string;
  userID: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetReviewsResponse {
  data: ReviewResponse[];
  averageRating: number;
  totalReviews: number;
  pagination: ReviewsPagination;
}

export interface GetReviewsParams {
  id: string;
  page?: number;
  limit?: number;
}

export type GetReviewsConfig = RequestConfig<GetReviewsParams>;

export const getReviews = async ({ params, config }: GetReviewsConfig) => {
  const queryParams: Record<string, string | number> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  return api.get<GetReviewsResponse>(`events/${params.id}/reviews`, {
    params: queryParams,
    ...config
  });
};

