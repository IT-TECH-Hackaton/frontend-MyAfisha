import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { AUTH_KEY, PATHS } from "@shared/constants";
import { toast } from "@shared/lib/hooks/use-toast";
import { Card, CardContent } from "@shared/ui/card";
import { usePostOAuthCallbackMutation } from "../signIn/api/usePostOAuthCallback";

export const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const provider = searchParams.get("provider") as "yandex" | "vk" | null;
  const error = searchParams.get("error");

  const callbackMutation = usePostOAuthCallbackMutation({
    options: {
      onSuccess: () => {
        localStorage.setItem(AUTH_KEY, "true");
        toast({
          title: "Успешная авторизация",
          description: "Вы успешно вошли через социальную сеть"
        });
        navigate("/");
      },
      onError(error: any) {
        const errorMessage = error?.response?.data?.message || "Ошибка авторизации";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка авторизации",
          description: errorMessage
        });
        navigate(PATHS.SIGNIN);
      }
    }
  });

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

    if (code && provider) {
      callbackMutation.mutate({
        params: {
          provider,
          code,
          state: state || undefined
        }
      });
    } else {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Отсутствуют необходимые параметры для авторизации"
      });
      navigate(PATHS.SIGNIN);
    }
  }, [code, provider, state, error]);

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

