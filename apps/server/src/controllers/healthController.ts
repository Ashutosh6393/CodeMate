import { Response, Request, NextFunction } from "express";

export const healthController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({ status: "ok" });
};
