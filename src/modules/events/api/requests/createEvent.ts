import { api } from "@shared/api/instance";

export interface CreateEventParams {
  title: string;
  shortDescription?: string;
  fullDescription: string;
  startDate: string;
  endDate: string;
  imageURL?: string;
  imageFile?: File;
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

export const createEvent = async ({ params, config }: CreateEventConfig) => {
  if (params.imageFile) {
    const formData = new FormData();
    
    formData.append("title", params.title);
    formData.append("fullDescription", params.fullDescription);
    formData.append("startDate", params.startDate);
    formData.append("endDate", params.endDate);
    formData.append("image", params.imageFile);
    
    if (params.shortDescription) {
      formData.append("shortDescription", params.shortDescription);
    }
    if (params.paymentInfo) {
      formData.append("paymentInfo", params.paymentInfo);
    }
    if (params.maxParticipants !== undefined && params.maxParticipants !== null) {
      formData.append("maxParticipants", params.maxParticipants.toString());
    }
    if (params.address) {
      formData.append("address", params.address);
    }
    if (params.latitude !== undefined && params.latitude !== null) {
      formData.append("latitude", params.latitude.toString());
    }
    if (params.longitude !== undefined && params.longitude !== null) {
      formData.append("longitude", params.longitude.toString());
    }
    if (params.yandexMapLink) {
      formData.append("yandexMapLink", params.yandexMapLink);
    }
    
    if (params.categoryIDs && params.categoryIDs.length > 0) {
      params.categoryIDs.forEach((id) => {
        formData.append("categoryIDs", id);
      });
    }
    
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach((tag) => {
        formData.append("tags", tag);
      });
    }
    
    if (params.participantIDs && params.participantIDs.length > 0) {
      params.participantIDs.forEach((id) => {
        formData.append("participantIDs", id);
      });
    }
    
    return api.post<{ id: string; message: string; imageURL?: string }>(
      "events",
      formData,
      {
        ...config,
        headers: {
          ...config?.headers
        }
      }
    );
  }
  
  return api.post<{ id: string; message: string }>("events", params, config);
};

