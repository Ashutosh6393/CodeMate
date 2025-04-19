import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwtHelpers.js";
import { ApiError } from "@repo/errors";

// this should return user if token is valid else 401
export const verifyController = async (req: Request, res: Response, next: NextFunction)=>{

    try {
        const Token = req.cookies.access_token;
        const token2 = req.cookies.refresh_token

        if(Token){
            const decoded = verifyToken(Token, "accessToken");
            if(decoded){
                res.send(decoded);
            }
        }
        console.log({Token, token2});
        

    } catch (error) {
        next(new ApiError("Token expired", 401, "UNAUTHORIZED"));
        
    }

}