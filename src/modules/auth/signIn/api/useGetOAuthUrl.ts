import { useQuery } from "@tanstack/react-query";

import { getOAuthUrl } from "./getOAuthUrl";

export const useGetOAuthUrl = (
  provider: "yandex" | "vk",
  settings?: QuerySettings<typeof getOAuthUrl>
) =>
  useQuery({
    queryKey: ["getOAuthUrl", provider],
    queryFn: () => getOAuthUrl({ params: { provider }, config: settings?.config }),
    enabled: false
  });

