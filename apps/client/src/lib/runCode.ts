import axios from "axios";
import { axiosConfig } from "./axiosConfig.ts";
import {getErrorMessage} from "@repo/errors"
import { toast } from "sonner";
export const submitCode = async (
  code: string,
  language: number,
  input?: string
) => {
  try {
    return await axios.post("/submitcode", { code, language, input: input || "" }, axiosConfig);
  } catch (error) {
    toast(getErrorMessage(error));
  }
};
