import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { z } from "zod";

import { PATHS } from "@shared/constants";
import { toast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { PasswordInput } from "@shared/ui/password-input";

import { usePostRegisterMutation } from "./api/usePostCreateUser";
import { signUpSchema } from "./lib/signUpSchema";

export const SignUpPage = () => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const navigate = useNavigate();

  const registerMutation = usePostRegisterMutation({
    options: {
      onSuccess: (data) => {
        toast({
          title: "Регистрация успешна",
          description: "На вашу почту отправлено письмо с кодом подтверждения"
        });
        navigate(PATHS.EMAIL_VERIFY, { state: { email: form.getValues("email") } });
      },
      onError(error) {
        if (error?.response?.data?.message) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes("уже существует") || errorMessage.includes("already exists")) {
            toast({
              className: "bg-red-800 text-white hover:bg-red-700",
              title: "Ошибка регистрации",
              description: "Пользователь с такой электронной почтой уже существует"
            });
          } else {
            toast({
              className: "bg-red-800 text-white hover:bg-red-700",
              title: "Ошибка регистрации",
              description: errorMessage
            });
          }
        } else {
          toast({
            className: "bg-red-800 text-white hover:bg-red-700",
            title: "Ошибка регистрации",
            description: "Не удалось выполнить запрос. Проверьте правильность введенных данных"
          });
        }
      }
    }
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const { fullName, email, password } = values;
    await registerMutation.mutateAsync({
      params: {
        fullName,
        email,
        password
      }
    });
  };

  const isDisabled =
    !form.formState.dirtyFields.fullName ||
    !form.formState.dirtyFields.confirmPassword ||
    !form.formState.dirtyFields.email ||
    !form.formState.dirtyFields.password;

  return (
    <Card className='m-auto w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-xl'>Регистрация</CardTitle>
        <CardDescription>Введите свои данные для создания учетной записи</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО*</FormLabel>
                  <FormControl>
                    <Input placeholder='Введите ФИО' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Электронная почта*</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Введите почту' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль*</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Введите пароль' {...field} />
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
                  <FormLabel>Подтвердите пароль*</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Подтвердите пароль' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={registerMutation.isPending || isDisabled}
              type='submit'
              className='w-full'
            >
              Зарегистрироваться
            </Button>
          </form>
        </Form>

        <div className='mt-4 text-center text-sm'>
          У вас уже есть учетная запись?{" "}
          <Link to={PATHS.SIGNIN} className='underline'>
            Войти
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
