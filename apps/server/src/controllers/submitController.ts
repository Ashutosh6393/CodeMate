import { Response, Request, NextFunction } from "express";
import { sendSuccess } from "../utils/response.js";
import axios, { AxiosError } from "axios";
import { ApiError, getErrorMessage } from "@repo/errors";

export const submitController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: {
      base64_encoded: "false",
      wait: "true",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      language_id: req.body.language,
      source_code: req.body.code,
      stdin: req.body.input,
    },
  };

  try {
    const response = await axios.request(options);
    sendSuccess(res, response.data, null, 200);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      // todo::: create submit error
      next(
        new ApiError(
          "Error submitting code",
          400,
          "BAD_REQUEST",
          
        )
      );
    } else {
      console.error("Error: file: submitController.ts: catchBlock\n", error);
      next(new Error("Error submitting code"));
    }
  }
};
