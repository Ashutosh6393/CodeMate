import { Response, Request } from "express";
import { sendSuccess } from "../utils/response.js";
export const submitController = async (req: Request, res: Response) => {
    console.log(req.body);
    sendSuccess(res, "summitted", null, 200);
};
