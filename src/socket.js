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
  io.use(async (socket, next) => {
    try {
      // 1. // Token extraction from auth object or Authorization headers
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // 3. Find user from DB
      const user = await User.findById(decoded?._id).select("-password");
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // 4. Attach verified user to socket context
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    // SERVER-SIDE ROOM JOINING (Secure & Non-spoofable)
    socket.join(userId);
    console.log(`🔒 Authenticated user ${socket.user.fullName} (${userId}) connected to socket`);

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