import { serverUrl } from "../../envConfig.ts";

export const axiosConfig = {
  withCredentials: true,
  baseURL: serverUrl,
  data: {},
};
