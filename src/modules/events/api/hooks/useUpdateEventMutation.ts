import { useMutation } from "@tanstack/react-query";

import type { UpdateEventConfig } from "../requests/updateEvent";
import { updateEvent } from "../requests/updateEvent";

export const useUpdateEventMutation = (settings?: MutationSettings<UpdateEventConfig, typeof updateEvent>) =>
  useMutation({
    mutationKey: ["updateEvent"],
    mutationFn: ({ params, config }) =>
      updateEvent({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

