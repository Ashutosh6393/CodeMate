import { accessTokenSecret, refreshTokenSceret } from "../config.js";
import jwt from "jsonwebtoken";

interface TokenSuccess {
  token: string;
  error?: never;
}

interface TokenFailure {
  token?: never;
  error: string;
}

interface tokenPayload {
  userId: string;
  name: string;
  email: string;
}

type tokenResponse = TokenSuccess | TokenFailure;
type tokenType = "accessToken" | "refreshToken";

export const createToken = (
  tokenPayload: tokenPayload,
  tokenType: tokenType
): tokenResponse => {
  const { userId, name, email } = tokenPayload;
  const payload = { userId, name, email };
  const options = {
    issuer: "codemate.v8coder.com",
    expiresIn: tokenType === "accessToken" ? 30 * 60 : 30 * 24 * 60 * 60,
  };
  const secret =
    tokenType === "accessToken" ? accessTokenSecret : refreshTokenSceret;

  try {
    const token = jwt.sign(payload, secret, options);
    if (token) {
      return { token };
    }
    throw new Error("Error generating access token");
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error generating token",
    };
  }
};

export const verifyToken = (jwtToken: string, tokenType: tokenType) => {
  const secret =
    tokenType === "accessToken" ? accessTokenSecret : refreshTokenSceret;

  try {
    const decoded = jwt.verify(jwtToken, secret);
    console.log("decoded token ", decoded)
    if (decoded) {
      return decoded;
    }
    throw new Error("Error verifying token");
  } catch (err) {
    return {
      error: (err instanceof Error && err.message) || "Error verifying token",
    };
  }
};
