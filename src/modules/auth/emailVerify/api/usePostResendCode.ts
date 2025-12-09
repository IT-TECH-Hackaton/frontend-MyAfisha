import { useMutation } from "@tanstack/react-query";

import type { PostResendCodeConfig } from "./postResendCode";
import { postResendCode } from "./postResendCode";

export const usePostResendCodeMutation = (
  settings?: MutationSettings<PostResendCodeConfig, typeof postResendCode>
) =>
  useMutation({
    mutationKey: ["postResendCode"],
    mutationFn: ({ params, config }) =>
      postResendCode({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

