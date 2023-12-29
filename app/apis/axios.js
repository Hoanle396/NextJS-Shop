import axios from "axios";
import { API_URL } from "../constants";
import nookies from "nookies";

let request = axios.create({
  baseURL: API_URL,
});
request.interceptors.request.use(
  async (config) => {
    if (!config.headers.Authorization) {
      const token = nookies.get(null)?.token?.replaceAll('"', "") ?? "";
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleError = async (error) => {
  const data = error?.response?.data;

  return Promise.reject(data);
};

request.interceptors.response.use((response) => response, handleError);

export default request;
