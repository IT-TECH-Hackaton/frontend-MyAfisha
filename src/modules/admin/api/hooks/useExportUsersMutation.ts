import { useMutation } from "@tanstack/react-query";

import type { ExportUsersConfig } from "../requests/exportUsers";
import { exportUsers } from "../requests/exportUsers";

export const useExportUsersMutation = (settings?: MutationSettings<ExportUsersConfig, typeof exportUsers>) =>
  useMutation({
    mutationKey: ["exportUsers"],
    mutationFn: ({ params, config }) =>
      exportUsers({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });

