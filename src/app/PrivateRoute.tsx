import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AUTH_KEY, PATHS } from "@shared/constants";

export const PrivateRoute = () => {
  const location = useLocation();

  if (localStorage.getItem(AUTH_KEY) === "false" || !localStorage.getItem(AUTH_KEY)) {
    localStorage.setItem(AUTH_KEY, "false");
    return <Navigate to={PATHS.SIGNIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
