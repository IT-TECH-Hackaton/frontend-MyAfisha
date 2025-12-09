import { api } from "@shared/api/instance";

export interface CreateEventParams {
  title: string;
  shortDescription?: string;
  fullDescription: string;
  startDate: string;
  endDate: string;
  imageURL: string;
  paymentInfo?: string;
  maxParticipants?: number;
  participantIDs?: string[];
  categoryIDs?: string[];
  tags?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  yandexMapLink?: string;
}

export type CreateEventConfig = RequestConfig<CreateEventParams>;

export const createEvent = async ({ params, config }: CreateEventConfig) =>
  api.post<{ id: string; message: string }>("events", params, config);

