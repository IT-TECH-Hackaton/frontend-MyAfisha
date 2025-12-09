import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { AUTH_KEY } from "@shared/constants";

export const AuthLayout = () => {
  const isAuth = localStorage.getItem(AUTH_KEY);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate(-1);
    }
  }, []);

  return (
    <main className='flex min-h-svh'>
      <Outlet />
    </main>
  );
};
