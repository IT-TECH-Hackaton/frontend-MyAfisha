export type EventStatus = "active" | "past" | "declined";

export interface Event {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  participantsCount: number;
  participantsLimit?: number;
  status: EventStatus;
  paymentInfo?: string;
  userParticipating: boolean;
  location?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export interface EventsApiError {
  message?: string;
}
