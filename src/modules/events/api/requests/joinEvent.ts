import { api } from "@shared/api/instance";

export type JoinEventConfig = RequestConfig<{ id: string }>;

export const joinEvent = async ({ params, config }: JoinEventConfig) =>
  api.post<{ message: string }>(`events/${params.id}/join`, undefined, config);

