import { useMutation } from "@tanstack/react-query";

import type { JoinEventConfig } from "../requests/joinEvent";
import { joinEvent } from "../requests/joinEvent";

export const useJoinEventMutation = (settings?: MutationSettings<JoinEventConfig, typeof joinEvent>) =>
  useMutation({
    mutationKey: ["joinEvent"],
    mutationFn: ({ params, config }) =>
      joinEvent({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

