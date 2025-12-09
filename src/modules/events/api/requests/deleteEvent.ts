import { api } from "@shared/api/instance";

export type DeleteEventConfig = RequestConfig<{ id: string }>;

export const deleteEvent = async ({ params, config }: DeleteEventConfig) =>
  api.delete<{ message: string }>(`events/${params.id}`, config);

