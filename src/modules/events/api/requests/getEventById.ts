import { api } from "@shared/api/instance";

import type { EventResponse } from "./getEvents";

export interface GetEventByIdResponse extends EventResponse {
  averageRating?: number;
  totalReviews?: number;
}

export type GetEventByIdConfig = RequestConfig<{ id: string }>;

export const getEventById = async ({ params, config }: GetEventByIdConfig) =>
  api.get<GetEventByIdResponse>(`events/${params.id}`, config);

