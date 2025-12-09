import { useQuery } from "@tanstack/react-query";

import { getInterests } from "../requests/getInterests";

export const useGetInterestsQuery = (settings?: QuerySettings<typeof getInterests>) => {
  const query = useQuery({
    queryKey: ["getInterests"],
    queryFn: async () => {
      const result = await getInterests({ config: settings?.config });
      return result;
    },
    ...settings?.options
  });

  return query;
};

