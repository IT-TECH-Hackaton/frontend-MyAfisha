import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { AUTH_KEY, PATHS, TOKEN_KEY } from "@shared/constants";
import { Button } from "@shared/ui/button";

import { usePostLogoutMutation } from "./api/usePostLogout";

export const LogoutButton = () => {
  const navigate = useNavigate();

      const { mutate } = usePostLogoutMutation({
        options: {
          onSuccess: () => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(AUTH_KEY);
            navigate(PATHS.SIGNIN);
          }
        }
      });

  return (
    <Button
      onClick={() => mutate({})}
      variant='ghost'
      className='gap-2 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400'
    >
      <LogOut className='h-4 w-4' />
      Выйти
    </Button>
  );
};
