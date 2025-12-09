import { useMutation } from "@tanstack/react-query";

import type { PostVerifyEmailConfig } from "./postVerifyEmail";
import { postVerifyEmail } from "./postVerifyEmail";

export const usePostVerifyEmailMutation = (
  settings?: MutationSettings<PostVerifyEmailConfig, typeof postVerifyEmail>
) =>
  useMutation({
    mutationKey: ["postVerifyEmail"],
    mutationFn: ({ params, config }) =>
      postVerifyEmail({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

