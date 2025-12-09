import { useMutation } from "@tanstack/react-query";

import type { LeaveEventConfig } from "../requests/leaveEvent";
import { leaveEvent } from "../requests/leaveEvent";

export const useLeaveEventMutation = (settings?: MutationSettings<LeaveEventConfig, typeof leaveEvent>) =>
  useMutation({
    mutationKey: ["leaveEvent"],
    mutationFn: ({ params, config }) =>
      leaveEvent({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

