import { Request, Response, NextFunction } from "express";
import { ApiError, getErrorMessage } from "@repo/errors";
import { loginBodySchema } from "../utils/zodSchemas.js";
import { createToken } from "../utils/jwtHelpers.js";
import { sendSuccess } from "../utils/response.js";
import { prisma } from "@repo/db";
import argon2 from "argon2";

export const signinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = loginBodySchema.safeParse(req.body);
    if (data) {
      const user = await prisma.user.findFirst({
        where: {
          email: data?.email,
        },
      });

      if (!user) {
        throw new ApiError("User not found", 404, "NOT_FOUND");
      }

      if (await argon2.verify(user.password, data.password)) {
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
          sendSuccess(res, "Login successfull");
        } else {
          throw new Error("Error generating token");
        }
      } else {
        throw new ApiError(
          "User name or password incorrect",
          401,
          "UNAUTHORIZED"
        );
      }
    } else if (error) {
      throw new ApiError("Invalid data format", 400, "BAD_REQUEST");
    }
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      console.log("\nError: file: signinController.ts: catchBlock:\n\n", error);
      next(new ApiError("Something went wrong", 500, "INTERNAL_SERVER_ERROR"));
    }
  }
};
