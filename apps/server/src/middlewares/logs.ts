import { Response, Request, NextFunction } from "express";

export const logs = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formatted = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  console.log(
    `${formatted} Method: ${req.method} Route: ${req.url} IP: ${req.ip}`
  );
  next();
};
