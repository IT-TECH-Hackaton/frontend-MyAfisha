import { useQuery } from "@tanstack/react-query";

import type { GetEventsConfig } from "../requests/getEvents";
import { getEvents } from "../requests/getEvents";

export const useGetEventsQuery = (settings?: QuerySettings<typeof getEvents> & { params?: GetEventsConfig["params"] }) => {
  const query = useQuery({
    queryKey: ["getEvents", settings?.params],
    queryFn: async () => {
      const result = await getEvents({ params: settings?.params, config: settings?.config });
      return result;
    },
    ...settings?.options
  });

  return query;
};

