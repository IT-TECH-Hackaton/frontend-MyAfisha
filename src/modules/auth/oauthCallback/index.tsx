import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { AUTH_KEY, PATHS, TOKEN_KEY } from "@shared/constants";
import { toast } from "@shared/lib/hooks/use-toast";
import { Card, CardContent } from "@shared/ui/card";

export const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const provider = searchParams.get("provider") as "yandex" | "vk" | null;
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка авторизации",
        description: "Не удалось авторизоваться через социальную сеть"
      });
      navigate(PATHS.SIGNIN);
      return;
    }

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(AUTH_KEY, "true");
      toast({
        title: "Успешная авторизация",
        description: `Вы успешно вошли через ${provider === "yandex" ? "Яндекс" : provider === "vk" ? "ВКонтакте" : "социальную сеть"}`
      });
      navigate("/");
    } else {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Отсутствует токен авторизации"
      });
      navigate(PATHS.SIGNIN);
    }
  }, [token, provider, error, navigate]);

  return (
    <div className='flex min-h-svh items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
            <p className='text-sm text-muted-foreground'>Завершение авторизации...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

