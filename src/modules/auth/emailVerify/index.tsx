import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { PATHS } from "@shared/constants";
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

export const EmailVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: ""
    }
  });

  const verifyMutation = usePostVerifyEmailMutation({
    options: {
      onSuccess: () => {
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
                      placeholder='Введите 6-значный код'
                      maxLength={6}
                      className='text-center text-2xl tracking-widest'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={verifyMutation.isPending || !form.formState.dirtyFields.code}
              type='submit'
              className='w-full'
            >
              Подтвердить
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          <Button
            variant='link'
            onClick={handleResendCode}
            disabled={resendMutation.isPending}
            className='text-sm'
          >
            Отправить код повторно
          </Button>
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

