import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { AUTH_KEY, PATHS, TOKEN_KEY } from "@shared/constants";
import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@shared/ui/dialog";

import { usePostLogoutMutation } from "./api/usePostLogout";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate } = usePostLogoutMutation({
    options: {
      onSuccess: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_KEY);
        navigate(PATHS.SIGNIN);
      }
    }
  });

  const handleLogout = () => {
    mutate({});
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant='ghost'
        className='gap-2 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400'
      >
        <LogOut className='h-4 w-4' />
        Выйти
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение выхода</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите выйти из аккаунта? Вам потребуется войти снова для доступа к системе.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant='destructive' onClick={handleLogout}>
              Выйти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
