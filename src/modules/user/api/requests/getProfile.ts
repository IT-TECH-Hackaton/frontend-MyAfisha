import type { UserData } from "@modules/user/types";

import { api } from "@shared/api/instance";

export const getProfile = ({ config }: RequestConfig) => api.get<UserData>(`/user/profile`, config);
