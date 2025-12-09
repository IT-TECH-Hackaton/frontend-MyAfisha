import { useMutation } from "@tanstack/react-query";

import type { ResetUserPasswordConfig } from "../requests/resetUserPassword";
import { resetUserPassword } from "../requests/resetUserPassword";

export const useResetUserPasswordMutation = (settings?: MutationSettings<ResetUserPasswordConfig, typeof resetUserPassword>) =>
  useMutation({
    mutationKey: ["resetUserPassword"],
    mutationFn: ({ params, config }) =>
      resetUserPassword({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

