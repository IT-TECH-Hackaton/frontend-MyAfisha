import { useMutation } from "@tanstack/react-query";

import type { ExportParticipantsConfig } from "../requests/exportParticipants";
import { exportParticipants } from "../requests/exportParticipants";

export const useExportParticipantsMutation = (
  settings?: MutationSettings<ExportParticipantsConfig, typeof exportParticipants>
) =>
  useMutation({
    mutationKey: ["exportParticipants"],
    mutationFn: ({ params, config }) =>
      exportParticipants({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

