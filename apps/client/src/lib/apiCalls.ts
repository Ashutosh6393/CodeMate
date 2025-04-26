import { signinSchema, signupSchema } from "../lib/zodSchemas.ts";
import axios, { AxiosError, AxiosResponse } from "axios";
import { getErrorMessage } from "@repo/errors";
import { axiosConfig } from "./axiosConfig.ts";
import { toast } from "sonner";
import z from "zod";

const verify = axios.create(axiosConfig);
const api = axios.create(axiosConfig);

verify.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (!err.response) {
      toast.error("Lost connection to server.");
    }
    if (err.response?.status === 401) {
      try {
        await axios.get("refresh", axiosConfig);
        return verify.get("/verify", axiosConfig);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Lost connection to server.");
    }
    return Promise.reject(error);
  }
);

export const signIn = (
  values: z.infer<typeof signinSchema>
): Promise<{ id: string; email: string; name: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post("/signin", values, axiosConfig);
      if (response.status === 200) {
        const res = await verifyAuth();
        resolve(res.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        reject(error.response?.data.message);
      }
    }
  });
};

export const signUp = (
  values: z.infer<typeof signupSchema>
): Promise<{ id: string; email: string; name: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: AxiosResponse = await api.post(
        "/signup",
        values,
        axiosConfig
      );
      if (response.status === 200) {
        const res: AxiosResponse = await verifyAuth();
        resolve(res.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        reject(error.response?.data.message);
      }
    }
  });
};

export const verifyAuth = async (): Promise<AxiosResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const data: AxiosResponse = await verify.get("/verify", axiosConfig);
      resolve(data.data);
    } catch (error) {
      reject(getErrorMessage(error));
    }
  });
};

export const runCode = async (
  code: string,
  language: number,
  input?: string
): Promise<AxiosResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(
        await api.post(
          "/submitcode",
          { code, language, input: input || "" },
          axiosConfig
        )
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          reject(error.response.data.message);
        }
        reject(getErrorMessage(error));
      }
      console.log("ERROR: API runCode", error);
    }
  });
};

export const healthCheck = async () => {
  return await api.get("/health", axiosConfig);
};
