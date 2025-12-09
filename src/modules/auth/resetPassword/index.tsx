import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { z } from "zod";

import { PATHS } from "@shared/constants";
import { toast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shared/ui/form";
import { PasswordInput } from "@shared/ui/password-input";

import { usePostResetPasswordMutation } from "./api/usePostResetPassword";

const passwordSchema = z
  .string()
  .min(8, { message: "Пароль должен содержать минимум 8 символов" })
  .regex(/[a-zA-Z]/, { message: "Пароль должен содержать латинские буквы" })
  .regex(/[0-9]/, { message: "Пароль должен содержать цифры" })
  .regex(/[^a-zA-Z0-9]/, { message: "Пароль должен содержать специальные символы" });

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"]
  });

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const resetPasswordMutation = usePostResetPasswordMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Пароль изменен",
          description: "Пароль успешно изменен. Пожалуйста, войдите в систему"
        });
        navigate(PATHS.SIGNIN);
      },
      onError(error) {
        if (error?.response?.data?.message) {
          const errorMessage = error.response.data.message;
          if (
            errorMessage.includes("истек") ||
            errorMessage.includes("expired") ||
            errorMessage.includes("недействителен") ||
            errorMessage.includes("invalid")
          ) {
            toast({
              className: "bg-red-800 text-white hover:bg-red-700",
              title: "Ссылка недействительна",
              description: "Ссылка для сброса пароля истекла или недействительна. Запросите новую ссылку"
            });
          } else {
            toast({
              className: "bg-red-800 text-white hover:bg-red-700",
              title: "Ошибка",
              description: errorMessage
            });
          }
        } else {
          toast({
            className: "bg-red-800 text-white hover:bg-red-700",
            title: "Ошибка",
            description: "Не удалось изменить пароль"
          });
        }
      }
    }
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    if (!token) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Отсутствует токен для сброса пароля"
      });
      return;
    }

    await resetPasswordMutation.mutateAsync({
      params: {
        token,
        password: values.password
      }
    });
  };

  if (!token) {
    return (
      <Card className='m-auto w-full max-w-sm'>
        <CardContent className='pt-6'>
          <p className='text-center text-sm text-muted-foreground'>
            Отсутствует токен для сброса пароля. Пожалуйста, запросите новую ссылку.
          </p>
          <Link to={PATHS.FORGOT_PASSWORD} className='mt-4 block text-center text-sm text-primary underline'>
            Запросить новую ссылку
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='m-auto w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-xl'>Сброс пароля</CardTitle>
        <CardDescription>Введите новый пароль для вашей учетной записи</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Введите новый пароль' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтвердите пароль</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Подтвердите новый пароль' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={resetPasswordMutation.isPending || !form.formState.dirtyFields.password}
              type='submit'
              className='w-full'
            >
              Изменить пароль
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          <Link to={PATHS.SIGNIN} className='text-primary underline'>
            Вернуться к входу
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

