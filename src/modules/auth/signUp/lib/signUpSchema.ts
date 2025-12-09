import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Пароль должен содержать минимум 8 символов" })
  .regex(/[a-zA-Z]/, { message: "Пароль должен содержать латинские буквы" })
  .regex(/[0-9]/, { message: "Пароль должен содержать цифры" })
  .regex(/[^a-zA-Z0-9]/, { message: "Пароль должен содержать специальные символы" });

const fullNameSchema = z
  .string()
  .min(1, { message: "ФИО обязательно для заполнения" })
  .regex(/^[а-яА-ЯёЁ\s]+$/, { message: "ФИО должно содержать только русские буквы" });

export const signUpSchema = z
  .object({
    fullName: fullNameSchema,
    email: z.string().email({ message: "Неверный адрес электронной почты" }),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"]
  });
