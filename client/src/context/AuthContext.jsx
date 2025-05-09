import { createContext, useEffect, useState } from "react";
import { setLogoutHandler } from "../lib/apiRequest";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const updateUser = (data) => {
    setCurrentUser(data);
  }

  useEffect(() => {
    setLogoutHandler(() => {
      setCurrentUser(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser))
  }, [currentUser])
  
  return (
    <AuthContext.Provider value={{ currentUser , updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};