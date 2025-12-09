import { useQuery } from "@tanstack/react-query";

import type { GetEventByIdConfig } from "../requests/getEventById";
import { getEventById } from "../requests/getEventById";

export const useGetEventByIdQuery = (settings?: QuerySettings<typeof getEventById> & { params?: GetEventByIdConfig["params"] }) => {
  const query = useQuery({
    queryKey: ["getEventById", settings?.params?.id],
    queryFn: async () => {
      if (!settings?.params?.id) {
        throw new Error("Event ID is required");
      }
      const result = await getEventById({ params: settings.params, config: settings?.config });
      return result;
    },
    enabled: !!settings?.params?.id,
    ...settings?.options
  });

  return query;
};

