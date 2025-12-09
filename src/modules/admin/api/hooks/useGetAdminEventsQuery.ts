import { useQuery } from "@tanstack/react-query";

import type { GetAdminEventsConfig } from "../requests/getAdminEvents";
import { getAdminEvents } from "../requests/getAdminEvents";

export const useGetAdminEventsQuery = (settings?: QuerySettings<typeof getAdminEvents> & { params?: GetAdminEventsConfig["params"] }) => {
  const query = useQuery({
    queryKey: ["getAdminEvents", settings?.params],
    queryFn: async () => {
      const result = await getAdminEvents({ params: settings?.params, config: settings?.config });
      return result;
    },
    ...settings?.options
  });

  return query;
};

