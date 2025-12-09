import { useMutation } from "@tanstack/react-query";

import type { PostOAuthCallbackConfig } from "./postOAuthCallback";
import { postOAuthCallback } from "./postOAuthCallback";

export const usePostOAuthCallbackMutation = (
  settings?: MutationSettings<PostOAuthCallbackConfig, typeof postOAuthCallback>
) =>
  useMutation({
    mutationKey: ["postOAuthCallback"],
    mutationFn: ({ params, config }) =>
      postOAuthCallback({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

