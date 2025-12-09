import { api } from "@shared/api/instance";

export interface ExportParticipantsParams {
  id: string;
  format?: "csv" | "xlsx";
}

export type ExportParticipantsConfig = RequestConfig<ExportParticipantsParams>;

export const exportParticipants = async ({ params, config }: ExportParticipantsConfig) => {
  const { id, format = "csv" } = params;
  const response = await api.get<Blob>(`events/${id}/export`, {
    params: { format },
    responseType: "blob",
    ...config
  });
  return response;
};

