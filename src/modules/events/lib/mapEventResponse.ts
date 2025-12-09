import type { Event, EventStatus } from "@modules/events/types/event";
import type { EventResponse } from "../api/requests/getEvents";

export const mapEventResponseToEvent = (response: EventResponse): Event => {
  const statusMap: Record<string, EventStatus> = {
    Активное: "active",
    Прошедшее: "past",
    Отклоненное: "declined"
  };

  return {
    id: response.id,
    title: response.title,
    shortDescription: response.shortDescription || "",
    description: response.fullDescription,
    startDate: response.startDate,
    endDate: response.endDate,
    imageUrl: response.imageURL,
    participantsCount: response.participantsCount,
    participantsLimit: response.maxParticipants,
    status: statusMap[response.status] || "active",
    paymentInfo: response.paymentInfo,
    userParticipating: response.isParticipant || false,
    location: response.address,
    coordinates: response.latitude && response.longitude
      ? { lat: response.latitude, lon: response.longitude }
      : undefined
  };
};

