import { api } from "@shared/api/instance";

export interface GetEventsParams {
  tab?: "active" | "my" | "past";
  page?: number;
  limit?: number;
  search?: string;
  categoryIDs?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "startDate" | "createdAt" | "participantsCount";
  sortOrder?: "ASC" | "DESC";
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
}

export interface EventOrganizer {
  id: string;
  fullName?: string;
  name?: string;
  email: string;
}

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
  categories?: EventCategory[];
  tags?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  yandexMapLink?: string;
  organizer?: EventOrganizer;
}

export interface EventsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetEventsResponse {
  data?: EventResponse[];
  Data?: EventResponse[];
  pagination?: EventsPagination;
  Pagination?: EventsPagination;
}

export type GetEventsConfig = RequestConfig<GetEventsParams>;

export const getEvents = async ({ params, config }: GetEventsConfig) => {
  const queryParams: Record<string, string | number | string[]> = {};
  
  if (params?.tab) queryParams.tab = params.tab;
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.search) queryParams.search = params.search;
  if (params?.dateFrom) queryParams.dateFrom = params.dateFrom;
  if (params?.dateTo) queryParams.dateTo = params.dateTo;
  if (params?.sortBy) queryParams.sortBy = params.sortBy;
  if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
  
  if (params?.categoryIDs && params.categoryIDs.length > 0) {
    queryParams.categoryIDs = params.categoryIDs;
  }
  
  if (params?.tags && params.tags.length > 0) {
    queryParams.tags = params.tags;
  }

  return api.get<GetEventsResponse>("events", {
    params: queryParams,
    ...config
  });
};

