import { Link, useLocation, useNavigate } from "react-router-dom";
import type { z } from "zod";

import { AUTH_KEY, PATHS, TOKEN_KEY } from "@shared/constants";
import { toast } from "@shared/lib/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

import { EmailForm } from "./_components/EmailForm";
import { OAuthButtons } from "./_components/OAuthButtons";
import { usePostLoginMutation } from "./api/usePostLoginMutation";
import type { signInMailSchema } from "./lib/signInMailSchema";

export const SignInPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutateAsync, isPending } = usePostLoginMutation({
    options: {
      onSuccess: (data) => {
        const token = data?.data?.token;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
        }
        localStorage.setItem(AUTH_KEY, "true");
        navigate(location.state?.pathname || "/");
      },
      onError(error) {
        if (error?.response?.data?.message) {
          toast({
            className: "bg-red-800 text-white hover:bg-red-700",
            title: "Ошибка авторизации",
            description: `${error.response.data.message}`
          });
        } else {
          toast({
            className: "bg-red-800 text-white hover:bg-red-700",
            title: "Неверные данные",
            description: "Проверьте правильность введенных данных"
          });
        }
      }
    }
  });

  const onSubmit = async (values: z.infer<typeof signInMailSchema>) => {
    await mutateAsync({ params: values });
  };

  return (
    <Card className='m-auto w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Вход</CardTitle>
      </CardHeader>
      <CardContent>
        <EmailForm onSubmit={onSubmit} isPending={isPending} />
        <div className='mt-6'>
          <OAuthButtons />
        </div>
        <div className='mt-4 text-center text-sm'>
          У вас нет учетной записи?{" "}
          <Link to={PATHS.SIGNUP} className='underline'>
            Зарегистрироваться
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
