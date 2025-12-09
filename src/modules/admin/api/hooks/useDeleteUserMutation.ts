import { useMutation } from "@tanstack/react-query";

import type { DeleteUserConfig } from "../requests/deleteUser";
import { deleteUser } from "../requests/deleteUser";

export const useDeleteUserMutation = (settings?: MutationSettings<DeleteUserConfig, typeof deleteUser>) =>
  useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: ({ params, config }) =>
      deleteUser({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

