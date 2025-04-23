import { Request, Response, NextFunction } from "express";
import { tokenConfig } from "../utils/tokenConfig.js";
import { verifyToken, createToken } from "../utils/jwtHelpers.js";
import { sendSuccess } from "../utils/response.js";
import { ApiError, getErrorMessage } from "@repo/errors";

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Token = req.cookies.refresh_token;
    if (Token) {
      const decoded = await verifyToken(Token, "refreshToken");
      if (decoded) {
        const { userId, email, name } = decoded;
        const accessToken = await createToken(
          { userId, email, name },
          "accessToken"
        );
        if (accessToken) {
          res.cookie("access_token", accessToken, {
            ...tokenConfig,
            maxAge: 30 * 60 * 1000,
          });
          sendSuccess(res, "Token refreshed", null, 200);
        } else {
          throw new Error("Error generating access token");
        }
      }
    } else {
      throw new ApiError("Token not found", 401, "UNAUTHORIZED");
    }
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      console.log("Error: file: refreshController.ts: catchBlock\n", error);
      next(new Error(getErrorMessage(error)));
    }
  }
};
