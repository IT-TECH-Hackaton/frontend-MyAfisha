import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { AUTH_KEY, PATHS, TOKEN_KEY } from "@shared/constants";
import { toast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shared/ui/form";
import { Input } from "@shared/ui/input";

import { usePostVerifyEmailMutation } from "./api/usePostVerifyEmail";
import { usePostResendCodeMutation } from "./api/usePostResendCode";

const verifyEmailSchema = z.object({
  code: z.string().min(6, { message: "Код должен содержать 6 символов" }).max(6)
});

const RESEND_TIMER_KEY = "email_verify_resend_timer";

export const EmailVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const getInitialTimer = () => {
    const savedEndTime = localStorage.getItem(RESEND_TIMER_KEY);
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      return remaining;
    }
    return 0;
  };

  const [resendTimer, setResendTimer] = useState(getInitialTimer);

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: ""
    }
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            localStorage.removeItem(RESEND_TIMER_KEY);
            return 0;
          }
          return newValue;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const verifyMutation = usePostVerifyEmailMutation({
    options: {
      onSuccess: (data: any) => {
        const token = data?.data?.token;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(AUTH_KEY, "true");
        }
        toast({
          title: "Почта подтверждена",
          description: "Регистрация завершена успешно. Вы можете войти в систему"
        });
        navigate(PATHS.SIGNIN);
      },
      onError(error: any) {
        if (error?.response?.data?.message) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes("неверный") || errorMessage.includes("invalid")) {
            toast({
              className: "bg-red-800 text-white hover:bg-red-700",
              title: "Неверный код",
              description: "Введенный код неверен. Проверьте код или запросите новый"
            });
          } else {
            toast({
              className: "bg-red-800 text-white hover:bg-red-700",
              title: "Ошибка подтверждения",
              description: errorMessage
            });
          }
        } else {
          toast({
            className: "bg-red-800 text-white hover:bg-red-700",
            title: "Ошибка подтверждения",
            description: "Не удалось подтвердить почту"
          });
        }
      }
    }
  });

  const resendMutation = usePostResendCodeMutation({
    options: {
      onSuccess: () => {
        const endTime = Date.now() + 60 * 1000;
        localStorage.setItem(RESEND_TIMER_KEY, endTime.toString());
        setResendTimer(60);
        toast({
          title: "Код отправлен",
          description: "Новый код подтверждения отправлен на вашу почту"
        });
      },
      onError() {
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: "Не удалось отправить код. Попробуйте позже"
        });
      }
    }
  });

  const onSubmit = async (values: z.infer<typeof verifyEmailSchema>) => {
    await verifyMutation.mutateAsync({
      params: {
        email,
        code: values.code
      }
    });
  };

  const handleResendCode = async () => {
    await resendMutation.mutateAsync({
      params: { email }
    });
  };

  if (!email) {
    return (
      <Card className='m-auto w-full max-w-sm'>
        <CardContent className='pt-6'>
          <p className='text-center text-sm text-muted-foreground'>
            Электронная почта не указана. Пожалуйста, начните регистрацию заново.
          </p>
          <Link to={PATHS.SIGNUP} className='mt-4 block text-center text-sm text-primary underline'>
            Вернуться к регистрации
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='m-auto w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-xl'>Подтверждение почты</CardTitle>
        <CardDescription>
          Введите код подтверждения, отправленный на {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Код подтверждения</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Проверочный код'
                      maxLength={6}
                      className='text-center tracking-widest'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={verifyMutation.isPending || form.watch("code")?.length !== 6}
              type='submit'
              className='w-full'
            >
              Подтвердить
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          {resendTimer > 0 ? (
            <p className='text-sm text-muted-foreground/60'>
              Повторная отправка кода будет доступна через {resendTimer} секунд
            </p>
          ) : (
            <Button
              variant='link'
              onClick={handleResendCode}
              disabled={resendMutation.isPending}
              className='text-sm'
            >
              Отправить код повторно
            </Button>
          )}
        </div>
        <div className='mt-4 text-center text-sm'>
          <Link to={PATHS.SIGNIN} className='text-primary underline'>
            Вернуться к входу
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

