import { useMutation } from "@tanstack/react-query";

import type { PostResetPasswordConfig } from "./postResetPassword";
import { postResetPassword } from "./postResetPassword";

export const usePostResetPasswordMutation = (
  settings?: MutationSettings<PostResetPasswordConfig, typeof postResetPassword>
) =>
  useMutation({
    mutationKey: ["postResetPassword"],
    mutationFn: ({ params, config }) =>
      postResetPassword({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

