import axios from "axios";
import { ENV } from "../config/env";

const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;