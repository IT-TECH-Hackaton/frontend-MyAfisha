import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../requests/getCategories";

export const useGetCategoriesQuery = (settings?: QuerySettings<typeof getCategories>) => {
  const query = useQuery({
    queryKey: ["getCategories"],
    queryFn: async () => {
      const result = await getCategories({ config: settings?.config });
      return result;
    },
    ...settings?.options
  });

  return query;
};

