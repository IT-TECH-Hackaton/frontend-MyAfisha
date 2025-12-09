import { useQuery } from "@tanstack/react-query";

import type { UserData } from "@modules/user/types";
import { getProfile } from "../requests/getProfile";

const mockUserData: UserData = {
  uid: "mock-uid-123",
  firstName: "Иван",
  secondName: "Иванов",
  mail: "ivan.ivanov@example.com",
  phone: "+7 (999) 123-45-67",
  tag: "@ivanov",
  birthDate: "1990-05-15",
  image: {
    uid: "img-123",
    name: "avatar.jpg",
    fileUrl: ""
  },
  role: "user"
};

export const useGetProfileQuery = (settings?: QuerySettings<typeof getProfile>) => {
  const query = useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      try {
        const result = await getProfile({ config: settings?.config });
        return result;
      } catch (error) {
        return {
          data: mockUserData
        } as { data: UserData };
      }
    },
    ...settings?.options
  });

  if (!query.data?.data) {
    return {
      ...query,
      data: {
        data: mockUserData
      } as { data: UserData }
    };
  }

  return query;
};
