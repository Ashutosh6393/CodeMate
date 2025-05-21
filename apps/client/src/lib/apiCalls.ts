import { signinSchema, signupSchema } from "../lib/zodSchemas";
import axios, { AxiosError, AxiosResponse } from "axios";
import { getErrorMessage } from "@repo/errors";
import { axiosConfig } from "./axiosConfig";
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
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Lost connection to server.");
    }
    return Promise.reject(error);
  },
);

export const signIn = async (values: z.infer<typeof signinSchema>) => {
  try {
    const response = await api.post("/signin", values, axiosConfig);
    if (response.status === 200) {
      const res = await verifyAuth();
      return res.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Signin failed.");
    }
    throw error;
  }
};

export const signUp = async (values: z.infer<typeof signupSchema>) => {
  try {
    const response: AxiosResponse = await api.post(
      "/signup",
      values,
      axiosConfig,
    );
    if (response.status === 200) {
      const res: AxiosResponse = await verifyAuth();
      return res.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Signup failed.");
    }
  }
};

export const verifyAuth = async (): Promise<AxiosResponse> => {
  try {
    const data: AxiosResponse = await verify.get("/verify", axiosConfig);
    return data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const runCode = async (
  code: string,
  language: number,
  input?: string,
) => {
  try {
    return await api.post(
      "/submitcode",
      { code, language, input: input || "" },
      axiosConfig,
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(error.response.data.data);
      }
    } else {
      console.log("ERROR: API runCode", error);
    }
  }
};

export const logout = async () => {
  try {
    return await api.get("/logout", axiosConfig);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(error.response.data.data);
      }
    } else {
      console.log("ERROR: API runCode", error);
    }
  }
};

export const healthCheck = async () => {
  return await api.get("/health", axiosConfig);
};
