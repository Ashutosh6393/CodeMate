import axios from "axios";
import { axiosConfig } from "./axiosConfig.ts";

export const submitCode = async (
  code: string,
  language: number,
  input?: string
) => {
  try {
    await axios.post("/submitcode", { code, language, input }, axiosConfig);
  } catch (error) {
    console.log(error);
  }
};
