import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8800/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiRequest;
