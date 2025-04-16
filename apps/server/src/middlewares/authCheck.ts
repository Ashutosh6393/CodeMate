import {Request, Response, NextFunction} from "express";
import { errorResponse } from "../utils/response.js";

import { verifyToken } from "../utils/jwtHelpers.js";

enum tokenType{
    accessToken, 
    refreshToken
}

export const authCheck = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const access_token = req.cookies.access_token;
        const valid = await verifyToken(access_token, tokenType.accessToken);

        if(valid){
            next();
        }else{
            res.status(401).json(errorResponse("Unauthorized"));

        }



    } catch (error) {
        res.status(500).json(errorResponse("Something went wrong"));
        
    }


}