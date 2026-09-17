import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem("accessToken") || "";

    const socketInstance = io("http://localhost:8000", {
      withCredentials: true,
      transports: ["websocket", "polling"], // Force fallback handling
      auth: {
        token: token,
      },
    });

    socketInstance.on("connect", () => {
      console.log("🔒 Socket Connected Successfully:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket Auth Failed:", err.message);
      setIsConnected(false);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);