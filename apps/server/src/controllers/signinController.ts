import { successResponse, errorResponse } from "../utils/response.js";
import { loginBodySchema } from "../utils/zodSchemas.js";
import { createToken } from "../utils/jwtHelpers.js";
import { Request, Response } from "express";
import { prisma } from "@repo/db";

import argon2 from "argon2";

enum tokenType {
  accessToken,
  refreshToken,
}

export const signinController = async (req: Request, res: Response) => {
  try {
    const { success, ...data } = loginBodySchema.safeParse(req.body);
    if (!success) {
      return res.status(406).json(errorResponse("Invalid data format"));
    }
    // if user not found returns null otherwise returns user

    const user = await prisma.user.findFirst({
      where: {
        email: data.data?.email,
      },
    });

    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }

    if (data.data) {
      if (await argon2.verify(user.password, data.data?.password)) {
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
        return res.status(200).json(successResponse("Login Successfull"));
      } else {
        return res.status(401).json(errorResponse("Invalid password"));
      }
    }

    return res.status(200).json(successResponse("Login Successfull"));
  } catch (error) {
    res.status(500).json(errorResponse("Something went wrong"));
  }
};
