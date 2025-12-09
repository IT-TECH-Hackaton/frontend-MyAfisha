import { useMutation } from "@tanstack/react-query";

import { postLogout } from "./postLogout";

export const usePostLogoutMutation = (
  settings?: MutationSettings<RequestConfig, typeof postLogout>
) =>
  useMutation({
    mutationKey: ["postLogout"],
    mutationFn: ({ config }) => postLogout({ config: { ...settings?.config, ...config } }),
    ...settings?.options
  });
