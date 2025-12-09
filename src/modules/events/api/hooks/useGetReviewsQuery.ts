import { useQuery } from "@tanstack/react-query";

import type { GetReviewsConfig } from "../requests/getReviews";
import { getReviews } from "../requests/getReviews";

export const useGetReviewsQuery = (settings?: QuerySettings<typeof getReviews> & { params?: GetReviewsConfig["params"] }) => {
  const query = useQuery({
    queryKey: ["getReviews", settings?.params?.id],
    queryFn: async () => {
      if (!settings?.params?.id) {
        throw new Error("Event ID is required");
      }
      const result = await getReviews({ params: settings.params, config: settings?.config });
      return result;
    },
    enabled: !!settings?.params?.id,
    ...settings?.options
  });

  return query;
};

