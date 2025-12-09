import { useMutation } from "@tanstack/react-query";

import type { UpdateProfileConfig } from "../requests/updateProfile";
import { updateProfile } from "../requests/updateProfile";

export const useUpdateProfileMutation = (
  settings?: MutationSettings<UpdateProfileConfig, typeof updateProfile>
) =>
  useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: ({ params, config }) =>
      updateProfile({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

