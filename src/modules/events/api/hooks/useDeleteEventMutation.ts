import { useMutation } from "@tanstack/react-query";

import type { DeleteEventConfig } from "../requests/deleteEvent";
import { deleteEvent } from "../requests/deleteEvent";

export const useDeleteEventMutation = (settings?: MutationSettings<DeleteEventConfig, typeof deleteEvent>) =>
  useMutation({
    mutationKey: ["deleteEvent"],
    mutationFn: ({ params, config }) =>
      deleteEvent({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

