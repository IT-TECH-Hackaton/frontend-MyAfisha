import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { PATHS } from "@shared/constants";
import { toast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shared/ui/form";
import { Input } from "@shared/ui/input";

import { usePostForgotPasswordMutation } from "./api/usePostForgotPassword";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Неверный адрес электронной почты" })
});

export const ForgotPasswordPage = () => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const forgotPasswordMutation = usePostForgotPasswordMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Письмо отправлено",
          description: "На указанную почту отправлено письмо со ссылкой для сброса пароля"
        });
      },
      onError(error) {
        if (error?.response?.data?.message) {
          toast({
            className: "bg-red-800 text-white hover:bg-red-700",
            title: "Ошибка",
            description: error.response.data.message
          });
        } else {
          toast({
            className: "bg-red-800 text-white hover:bg-red-700",
            title: "Ошибка",
            description: "Не удалось отправить письмо. Проверьте правильность введенной почты"
          });
        }
      }
    }
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    await forgotPasswordMutation.mutateAsync({
      params: {
        email: values.email
      }
    });
  };

  return (
    <Card className='m-auto w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-xl'>Восстановление пароля</CardTitle>
        <CardDescription>
          Введите электронную почту, на которую будет отправлена ссылка для сброса пароля
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Электронная почта</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Введите почту' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={forgotPasswordMutation.isPending || !form.formState.dirtyFields.email}
              type='submit'
              className='w-full'
            >
              Отправить ссылку
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

