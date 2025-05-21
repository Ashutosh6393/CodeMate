import { Request, Response } from "express";
import { sendError } from "../utils/response.js";
import { ApiError, CompilerError } from "@repo/errors";

interface CustormError extends Error {
  statusCode?: number;
  code?: string;
  details?: string;
}

export const errorHandler = (
  err: CustormError,
  req: Request,
  res: Response,
) => {
  if (err instanceof ApiError) {
    sendError(res, err.message, err.code, err.details, err.statusCode);
  } else if (err instanceof CompilerError) {
    sendError(res, err.message, err.code, "", err.statusCode, err.data);
  } else {
    sendError(
      res,
      "Internal Server Error",
      "INTERNAL_SERVER_ERROR",
      err.details || "",
      err.statusCode || 500,
    );
  }
};
