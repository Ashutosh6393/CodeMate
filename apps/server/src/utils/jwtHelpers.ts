import { accessTokenSecret, refreshTokenSceret } from "../config.js";
import { getErrorMessage } from "@repo/errors";
import jwt, { JwtPayload } from "jsonwebtoken";

interface tokenPayload {
  userId: string;
  name: string;
  email: string;
}

type tokenType = "accessToken" | "refreshToken";

export const createToken = (
  tokenPayload: tokenPayload,
  tokenType: tokenType
): Promise<string> => {
  const { userId, name, email } = tokenPayload;
  const payload = { userId, name, email };
  const options = {
    issuer: "codemate.v8coder.com",
    expiresIn: tokenType === "accessToken" ? 30 * 60 : 30 * 24 * 60 * 60,
  };
  const secret =
    tokenType === "accessToken" ? accessTokenSecret : refreshTokenSceret;

  return new Promise((resolve, reject) => {
    try {
      jwt.sign(payload, secret, options, (err, token) => {
        if (token) {
          resolve(token);
        }
        reject(getErrorMessage(err));
      });
    } catch (err) {
      reject(getErrorMessage(err));
    }
  });
};

type DecodedToken = JwtPayload & tokenPayload;

export const verifyToken = (
  jwtToken: string,
  tokenType: tokenType
): Promise<DecodedToken> => {
  const secret =
    tokenType === "accessToken" ? accessTokenSecret : refreshTokenSceret;

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(jwtToken, secret, (err, decoded) => {
        if (decoded) resolve(decoded as DecodedToken);
        reject(getErrorMessage(err));
      });
    } catch (err) {
      reject(getErrorMessage(err));
    }
  });
};
