// import { serverUrl } from "../../envConfig";

export const axiosConfig = {
  withCredentials: true,
  baseURL: import.meta.env.VITE_SERVER_URL,
  data: {},
};
