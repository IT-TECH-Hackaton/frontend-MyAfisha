import { useMutation } from "@tanstack/react-query";

import type { CreateUserConfig } from "../requests/createUser";
import { createUser } from "../requests/createUser";

export const useCreateUserMutation = (settings?: MutationSettings<CreateUserConfig, typeof createUser>) =>
  useMutation({
    mutationKey: ["createUser"],
    mutationFn: ({ params, config }) =>
      createUser({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

