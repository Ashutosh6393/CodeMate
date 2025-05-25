import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  code: string = "INTERNAL_SERVER_ERROR",
  details: string = "",
  statusCode: number = 500,
  data?: object,
) => {
  const responseBody: {
    success: boolean;
    message: string;
    error: { code: string; details: string };
    data?: object;
  } = {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };

  if (data) {
    responseBody.data = data;
  }

  return res.status(statusCode).json(responseBody);
};
