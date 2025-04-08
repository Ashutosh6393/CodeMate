import { Request, Response } from "express";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email({message: "Invalid email"}),
  password: z.string().min(8).max(50),
});

export const signinController = async (req: Request, res: Response) => {
  try {
    const { success } = bodySchema.safeParse(req.body);




  } catch (error) {}
  res.status(200).json({ message: "signin" });
};
