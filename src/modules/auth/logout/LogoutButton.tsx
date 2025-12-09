import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { AUTH_KEY, PATHS } from "@shared/constants";
import { Button } from "@shared/ui/button";

import { usePostLogoutMutation } from "./api/usePostLogout";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const { mutate } = usePostLogoutMutation({
    options: {
      onSuccess: () => {
        localStorage.removeItem(AUTH_KEY);
        navigate(PATHS.SIGNIN);
      }
    }
  });

  return (
    <Button onClick={() => mutate({})} variant='ghost' className='gap-2'>
      <LogOut className='h-4 w-4' />
      Выйти
    </Button>
  );
};
