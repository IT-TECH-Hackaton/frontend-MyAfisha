import { api } from "@shared/api/instance";

export interface CreateUserParams {
  fullName: string;
  email: string;
  password: string;
  role?: "Пользователь" | "Администратор";
}

export interface CreateUserResponse {
  message: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export type CreateUserConfig = RequestConfig<CreateUserParams>;

export const createUser = async ({ params, config }: CreateUserConfig) =>
  api.post<CreateUserResponse>("admin/users", params, config);

