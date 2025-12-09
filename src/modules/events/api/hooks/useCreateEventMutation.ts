import { useMutation } from "@tanstack/react-query";

import type { CreateEventConfig } from "../requests/createEvent";
import { createEvent } from "../requests/createEvent";

export const useCreateEventMutation = (settings?: MutationSettings<CreateEventConfig, typeof createEvent>) =>
  useMutation({
    mutationKey: ["createEvent"],
    mutationFn: ({ params, config }) =>
      createEvent({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

