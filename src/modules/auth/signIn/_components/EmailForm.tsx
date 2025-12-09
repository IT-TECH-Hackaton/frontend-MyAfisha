import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { PATHS } from "@shared/constants";
import { Button } from "@shared/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { PasswordInput } from "@shared/ui/password-input";

import { signInMailSchema } from "../lib/signInMailSchema";

interface MailFormProps {
  onSubmit: (values: z.infer<typeof signInMailSchema>) => Promise<void>;
  isPending: boolean;
}

export const EmailForm = ({ onSubmit, isPending }: MailFormProps) => {
  const signInMailForm = useForm<z.infer<typeof signInMailSchema>>({
    resolver: zodResolver(signInMailSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  return (
    <Form {...signInMailForm}>
      <form onSubmit={signInMailForm.handleSubmit(onSubmit)} className='grid gap-4'>
        <FormField
          control={signInMailForm.control}
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
        <FormField
          control={signInMailForm.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Введите пароль' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='text-right'>
          <Link to={PATHS.FORGOT_PASSWORD} className='text-sm text-primary underline'>
            Забыли пароль?
          </Link>
        </div>
        <Button
          disabled={
            !signInMailForm.formState.dirtyFields.password ||
            !signInMailForm.formState.dirtyFields.email ||
            isPending
          }
          type='submit'
          className='w-full'
        >
          Войти
        </Button>
      </form>
    </Form>
  );
};
