import { accessTokenSecret, refreshTokenSceret } from "../config.js";
import jwt from "jsonwebtoken";
import createHttpError, { HttpError } from "http-errors";

enum tokenType {
  accessToken,
  refreshToken,
}

export const createToken = (
  userId: string,
  token: tokenType
): Promise<string | HttpError> => {
  return new Promise((resolve, reject) => {
    if (token === tokenType.accessToken) {
      const accessTokenPayload = {};
      const accessTokenOptions = {
        audience: userId,
        issuer: "codemate.v8coder.com",
        expiresIn: 30 * 60,
      };
      jwt.sign(
        accessTokenPayload,
        accessTokenSecret,
        accessTokenOptions,
        (err, token) => {
          if (err) {
            console.log(err.message);
            reject(createHttpError.InternalServerError());
            return;
          } else if (token) {
            resolve(token);
          }
        }
      );
    } else if (token === tokenType.refreshToken) {
      const refreshTokenPayload = {};
      const refreshTokenOptions = {
        audience: userId,
        issuer: "codemate.v8coder.com",
        expiresIn: 7 * 24 * 60 * 60,
      };
      jwt.sign(
        refreshTokenPayload,
        refreshTokenSceret,
        refreshTokenOptions,
        (err, token) => {
          if (err) {
            console.log(err.message);
            reject(createHttpError.InternalServerError());
            return;
          } else if (token) {
            resolve(token);
          }
        }
      );
    }
  });
};

export const verifyToken = (
  jwtToken: string,
  token: tokenType
): Promise<string | jwt.JwtPayload | undefined | HttpError> => {
  return new Promise((resolve, reject) => {
    if (token === tokenType.accessToken) {
      jwt.verify(jwtToken, refreshTokenSceret, (err, decoded) => {
        if (err) {
          console.log(err.message);
          reject(createHttpError.Unauthorized(err.message));
        } else {
          resolve(decoded);
        }
      });
    } else if (token === tokenType.refreshToken) {
      jwt.verify(jwtToken, refreshTokenSceret, (err, decoded) => {
        if (err) {
          console.log(err.message);
          reject(createHttpError.Unauthorized(err.message));
        } else {
          resolve(decoded);
        }
      });
    }
  });
};
