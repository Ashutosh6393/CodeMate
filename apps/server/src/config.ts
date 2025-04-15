import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const accessTokenSecret: string = process.env.JWT_ACCESS_TOKEN_SECRET || "some-dev-secret";
export const refreshTokenSceret: string = process.env.JWT_REFRESH_TOKEN_SECRET || "some-super-secret";



