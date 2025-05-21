import { z } from "zod";
export const signupSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Email too short" })
    .email({ message: "Enter valid email" })
    .max(50, { message: "Email too long" }),
  name: z
    .string()
    .min(2, { message: "Name too short" })
    .max(100, { message: "Name too long" }),
  password: z
    .string()
    .max(50, { message: "Password too long" })
    .min(8, { message: "Password too short" }),
});

export const signinSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Email too short" })
    .email({ message: "Invalid email" })
    .max(50, { message: "Email too long" }),
  password: z
    .string()
    .max(50, { message: "Password too long" })
    .min(8, { message: "Password too short" }),
});
