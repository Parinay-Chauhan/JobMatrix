import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "./models/user.model.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  // Socket.IO Handshake Authentication Middleware
  // Backend handshake middleware code update:
  io.use(async (socket, next) => {
    try {
      // Cookie parsing support for socket handshake
      const cookieHeader = socket.handshake.headers?.cookie || "";
      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => c.split("=")),
      );

      // Token extract: Auth object > Authorization Header > Cookies
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
        cookies?.accessToken;

      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded?._id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    // SERVER-SIDE ROOM JOINING
    socket.join(userId);
    console.log(
      `🔒 Authenticated user ${socket.user.fullName} (${userId}) connected to socket`,
    );

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};
