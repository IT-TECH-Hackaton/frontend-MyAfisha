import { useMutation } from "@tanstack/react-query";

import type { UpdateUserConfig } from "../requests/updateUser";
import { updateUser } from "../requests/updateUser";

export const useUpdateUserMutation = (settings?: MutationSettings<UpdateUserConfig, typeof updateUser>) =>
  useMutation({
    mutationKey: ["updateUser"],
    mutationFn: ({ params, config }) =>
      updateUser({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

