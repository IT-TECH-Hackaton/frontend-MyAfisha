import { api } from "@shared/api/instance";

export interface UpdateEventParams {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  startDate?: string;
  endDate?: string;
  imageURL?: string;
  paymentInfo?: string;
  maxParticipants?: number;
  status?: "Активное" | "Прошедшее" | "Отклоненное";
  categoryIDs?: string[];
  tags?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  yandexMapLink?: string;
}

export type UpdateEventConfig = RequestConfig<UpdateEventParams & { id: string }>;

export const updateEvent = async ({ params, config }: UpdateEventConfig) => {
  const { id, ...updateData } = params;
  return api.put<{ message: string }>(`events/${id}`, updateData, config);
};

