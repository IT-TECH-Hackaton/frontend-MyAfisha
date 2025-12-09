import { api } from "@shared/api/instance";

export interface GetAdminEventsParams {
  status?: "Активное" | "Прошедшее" | "Отклоненное";
}

export interface AdminEventResponse {
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
  categoryIDs?: string[];
  organizer: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export type GetAdminEventsConfig = RequestConfig<GetAdminEventsParams>;

export const getAdminEvents = async ({ params, config }: GetAdminEventsConfig) => {
  const queryParams: Record<string, string> = {};
  if (params?.status) queryParams.status = params.status;

  return api.get<AdminEventResponse[]>("admin/events", {
    params: queryParams,
    ...config
  });
};

