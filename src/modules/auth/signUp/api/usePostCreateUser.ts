import { useMutation } from "@tanstack/react-query";

import type { PostCreateUserConfig } from "./postCreateUser";
import { postCreateUser } from "./postCreateUser";

export const usePostRegisterMutation = (
  settings?: MutationSettings<PostCreateUserConfig, typeof postCreateUser>
) =>
  useMutation({
    mutationKey: ["postCreateUser"],
    mutationFn: ({ params, config }) =>
      postCreateUser({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });
