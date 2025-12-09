import { api } from "@shared/api/instance";

import type { UserResponse } from "./getUsers";

export type GetUserByIdConfig = RequestConfig<{ id: string }>;

export const getUserById = async ({ params, config }: GetUserByIdConfig) =>
  api.get<UserResponse>(`admin/users/${params.id}`, config);

