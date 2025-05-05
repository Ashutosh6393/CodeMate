import { NextFunction, Request, Response } from "express";
import { tokenConfig } from "../utils/tokenConfig.js";
import { sendSuccess } from "../utils/response.js";
import { ApiError } from "@repo/errors";

export const logoutController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("access_token", tokenConfig);
    res.clearCookie("refresh_token", tokenConfig);
    sendSuccess(res, "Logged out", null, 200);
  } catch (error) {
    next(new ApiError("Error logging out", 400, "BAD_REQUEST"));
  }
};
