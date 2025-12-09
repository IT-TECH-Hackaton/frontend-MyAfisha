import { api } from "@shared/api/instance";

export interface EventResponse {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  startDate: string;
  endDate: string;
  imageURL: string;
  paymentInfo?: string;
  maxParticipants?: number;
  status: "Активное" | "Прошедшее" | "Отклоненное";
  participantsCount: number;
  isParticipant?: boolean;
  address?: string;
}

export const getEvents = async (tab: "active" | "my" | "past" | null) => {
  const params = tab ? { tab } : undefined;
  const { data } = await api.get<EventResponse[]>("/api/events", { params });
  return data;
};

export const postJoinEvent = async (id: string) => {
  const { data } = await api.post<{ message: string }>(`/api/events/${id}/join`);
  return data;
};

export const deleteLeaveEvent = async (id: string) => {
  const { data } = await api.delete<{ message: string }>(`/api/events/${id}/leave`);
  return data;
};