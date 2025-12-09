import { api } from "@shared/api/instance";

export type LeaveEventConfig = RequestConfig<{ id: string }>;

export const leaveEvent = async ({ params, config }: LeaveEventConfig) =>
  api.delete<{ message: string }>(`events/${params.id}/leave`, config);

