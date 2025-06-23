import { z } from "zod";

export const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const newPasswordFormSchema = z.object({
  password: z.string().min(6),
  token: z.string(),
});

export const resetPasswordFormSchema = z.object({
  email: z.string().email(),
});
