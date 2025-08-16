import { z } from "zod";

export const signInSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Invalid phone number" })
    .max(10, { message: "Invalid phone number" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
