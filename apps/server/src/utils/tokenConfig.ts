import { CookieOptions } from "express";

export const tokenConfig: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "strict",
  maxAge: 30 * 60 * 1000,
};
