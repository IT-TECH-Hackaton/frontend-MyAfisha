import { z } from "zod";

export const signInMailSchema = z.object({
  email: z.string().email({ message: "Неверный адрес электронной почты" }),
  password: z.string().min(1, { message: "Пароль обязателен для заполнения" })
});
