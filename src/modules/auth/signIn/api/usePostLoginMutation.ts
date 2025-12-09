import { useMutation } from "@tanstack/react-query";

import type { PostLoginConfig } from "./postLogin";
import { postLogin } from "./postLogin";

export const usePostLoginMutation = (
  settings?: MutationSettings<PostLoginConfig, typeof postLogin>
) =>
  useMutation({
    mutationKey: ["postLogin"],
    mutationFn: ({ params, config }) =>
      postLogin({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });
