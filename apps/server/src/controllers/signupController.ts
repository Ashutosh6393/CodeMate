import { Request, Response } from "express";
import { signupBodySchema } from "../utils/zodSchemas.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { prisma } from "@repo/db";
import argon2 from "argon2"

export const signupController = async (req: Request, res: Response) => {
  try {
    const { success, ...data } = signupBodySchema.safeParse(req.body);
    if (!success) {
      return res.status(406).json(errorResponse("Invalid data format"));
    }

    if (data.data) {
      // hash password
      const hashedPassword = await argon2.hash(data.data.password);

      //throws error if user already exists & user data if not
      await prisma.users.create({
        data: {
          email: data.data?.email,
          name: data.data?.name,
          password: hashedPassword,
        },
      });
    }

    return res.status(200).json(successResponse("Signup Successfull"));
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json(errorResponse("User already exists"));
    } else {
      return res.status(500).json(errorResponse("Something went wrong"));
    }
  }
};
