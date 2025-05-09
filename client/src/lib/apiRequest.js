import axios from "axios";

const apiRequest = axios.create({
  baseURL: import.meta.env.MODE === "production" ? import.meta.env.VITE_API_BASE_URL : "http://localhost:8800/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let logoutHandler = null;

apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && logoutHandler) {
      logoutHandler();
    }
    return Promise.reject(error);
  }
);

export const setLogoutHandler = (fn) => {
  logoutHandler = fn;
};

export default apiRequest;
