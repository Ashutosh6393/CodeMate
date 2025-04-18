import { sendSuccess } from "../utils/response.js";
import { NextFunction, Request, Response } from "express";
import { signupBodySchema } from "../utils/zodSchemas.js";
import { ApiError, getErrorMessage } from "@repo/errors";
import { prisma } from "@repo/db";
import argon2 from "argon2";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = signupBodySchema.safeParse(req.body);

    if (data) {
      const hashedPassword = await argon2.hash(data.password);
      await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
        },
      });

      sendSuccess(res, "Signup Successfull", {}, 200);
    } else if (error) {
      throw new ApiError("Invalid data", 400, "BAD_REQUEST");
    }
  } catch (error: any) {
    if (error.code === "P2002") {
      next(new ApiError("User already exists", 409, "CONFLICT"));
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(getErrorMessage(error), 500, "INTERNAL_SERVER_ERROR"));
    }
  }
};
