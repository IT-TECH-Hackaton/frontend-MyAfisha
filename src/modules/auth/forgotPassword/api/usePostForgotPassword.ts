import { useMutation } from "@tanstack/react-query";

import type { PostForgotPasswordConfig } from "./postForgotPassword";
import { postForgotPassword } from "./postForgotPassword";

export const usePostForgotPasswordMutation = (
  settings?: MutationSettings<PostForgotPasswordConfig, typeof postForgotPassword>
) =>
  useMutation({
    mutationKey: ["postForgotPassword"],
    mutationFn: ({ params, config }) =>
      postForgotPassword({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

