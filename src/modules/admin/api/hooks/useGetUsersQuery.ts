import { useQuery } from "@tanstack/react-query";

import type { GetUsersConfig } from "../requests/getUsers";
import { getUsers } from "../requests/getUsers";

export const useGetUsersQuery = (settings?: QuerySettings<typeof getUsers> & { params?: GetUsersConfig["params"] }) => {
  const query = useQuery({
    queryKey: ["getUsers", settings?.params],
    queryFn: async () => {
      const result = await getUsers({ params: settings?.params, config: settings?.config });
      return result;
    },
    ...settings?.options
  });

  return query;
};

