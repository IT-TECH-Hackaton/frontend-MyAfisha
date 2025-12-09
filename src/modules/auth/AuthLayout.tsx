import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { AUTH_KEY, PATHS } from "@shared/constants";

export const AuthLayout = () => {
  const isAuth = localStorage.getItem(AUTH_KEY) === "true";
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate(PATHS.PROFILE, { replace: true });
    }
  }, [isAuth, navigate]);

  if (isAuth) {
    return null;
  }

  return (
    <main className='flex min-h-svh'>
      <Outlet />
    </main>
  );
};
