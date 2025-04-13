import { z } from "zod";

export const loginBodySchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password too short" })
    .max(50, { message: "Password too long" }),
});

export const signupBodySchema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    name: z.string().min(3, { message: "Name too short" }).max(50, { message: "Name too long" }),
    password: z.string().min(8, { message: "Password too short" }).max(50, { message: "Password too long" }),
})
