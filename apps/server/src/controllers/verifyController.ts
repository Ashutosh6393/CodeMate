import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtHelpers.js";
import { sendSuccess } from "../utils/response.js";
import { ApiError, getErrorMessage } from "@repo/errors";

export const verifyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Token = req.cookies.access_token;
    if (Token) {
      const decoded = await verifyToken(Token, "accessToken");
      if (decoded) {
        sendSuccess(res, "Token valid", decoded, 200);
      }
    } else {
      throw new ApiError("Token not found", 401, "UNAUTHORIZED");
    }
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      console.log("Error: file: verifyController.ts: catchBlock\n", error);
      next(new Error(getErrorMessage(error)));
    }
  }
};
