import { Request, Response, NextFunction } from "express";
import { ApiError, getErrorMessage } from "@repo/errors";
import { verifyToken } from "../utils/jwtHelpers.js";
import { sendError } from "../utils/response.js";

enum tokenType {
  accessToken,
  refreshToken,
}

export const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const access_token = req.cookies.access_token;
    const valid = await verifyToken(access_token, tokenType.accessToken);

    if (valid) {
      next();
    } else {
      throw new ApiError("Token expired", 401, "UNAUTHORIZED");
    }
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      sendError(res, getErrorMessage(error), "INTERNAL_SERVER_ERROR", "", 500);
    }
  }
};
