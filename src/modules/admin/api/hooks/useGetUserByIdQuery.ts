import { useQuery } from "@tanstack/react-query";

import type { GetUserByIdConfig } from "../requests/getUserById";
import { getUserById } from "../requests/getUserById";

export const useGetUserByIdQuery = (settings?: QuerySettings<typeof getUserById> & { params?: GetUserByIdConfig["params"] }) => {
  const query = useQuery({
    queryKey: ["getUserById", settings?.params?.id],
    queryFn: async () => {
      if (!settings?.params?.id) {
        throw new Error("User ID is required");
      }
      const result = await getUserById({ params: settings.params, config: settings?.config });
      return result;
    },
    enabled: !!settings?.params?.id,
    ...settings?.options
  });

  return query;
};

