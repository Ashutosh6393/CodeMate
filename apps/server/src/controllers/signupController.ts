import { NextFunction, Request, Response } from "express";
import { signupBodySchema } from "../utils/zodSchemas.js";
import { ApiError, getErrorMessage } from "@repo/errors";
import { sendSuccess } from "../utils/response.js";
import { prisma } from "@repo/db";
import argon2 from "argon2";
import { createToken } from "../utils/jwtHelpers.js";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = signupBodySchema.safeParse(req.body);
    if (data) {
      const hashedPassword = await argon2.hash(data.password);
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
        },
      });

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
      };
      const accessToken = await createToken(tokenPayload, "accessToken");
      const refreshToken = await createToken(tokenPayload, "refreshToken");

      if (accessToken && refreshToken) {
        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 30 * 60 * 1000,
        });
        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        sendSuccess(res, "Signup successfull");
      } else {
        throw new Error("Error generating token");
      }
    } else if (error) {
      throw new ApiError("Invalid data", 400, "BAD_REQUEST");
    }
  } catch (error: any) {
    if (error.code === "P2002") {
      next(new ApiError("User already exists", 409, "CONFLICT"));
    } else if (error instanceof ApiError) {
      next(error);
    } else {
      console.log("\nError: file: signupController.ts: catchBlock:\n\n", error);
      next(new Error(getErrorMessage(error)));
    }
  }
};
