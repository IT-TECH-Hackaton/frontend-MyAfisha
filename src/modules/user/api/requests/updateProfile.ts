import { api } from "@shared/api/instance";

interface UpdateProfileParams {
  fullName?: string;
  phone?: string;
  birthDate?: string;
  imageURL?: string;
}

export type UpdateProfileConfig = RequestConfig<UpdateProfileParams>;

export const updateProfile = async ({ params, config }: UpdateProfileConfig) =>
  api.put<any>("user/profile", params, config);

