import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const {currentUser} = useContext(AuthContext);

  useEffect(() => {
    setSocket(
      io(
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_SOCKET_URL
          : "http://localhost:4000"
      )
    );
  }, []);

  useEffect(() => {
    currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
