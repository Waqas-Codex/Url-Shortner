// create axios instance with baseURL
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;