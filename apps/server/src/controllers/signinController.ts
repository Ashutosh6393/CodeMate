import { Request, Response, NextFunction } from "express";
import { ApiError, getErrorMessage } from "@repo/errors";
import { loginBodySchema } from "../utils/zodSchemas.js";
import { createToken } from "../utils/jwtHelpers.js";
import { sendSuccess } from "../utils/response.js";
import { prisma } from "@repo/db";
import argon2 from "argon2";

enum tokenType {
  accessToken,
  refreshToken,
}

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
        const accessToken = await createToken(user.id, tokenType.accessToken);
        const refreshToken = await createToken(user.id, tokenType.refreshToken);

        if (accessToken && refreshToken) {
          res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "lax",
          });
          res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          });
        }
        sendSuccess(res, "Login successfull");
      } else {
        throw new ApiError("unauthorized", 401, "UNAUTHORIZED");
      }
    } else if (error) {
      throw new ApiError("Invalid data", 400, "BAD_REQUEST");
    }
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(getErrorMessage(error), 500, "INTERNAL_SERVER_ERROR"));
    }
  }
};
