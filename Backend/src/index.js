import "dotenv/config";
import http from "http";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { initializeSocket } from "./socket.js";

// 1. Express app ko http server me wrap karo
const server = http.createServer(app);

// 2. Socket.IO ko http server ke sath initialize karo
initializeSocket(server);

connectDB()
  .then(() => {
    // 3. app.listen ki jagah HTTP server.listen use karo
    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️  Server is running on port at ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection fail !!!`, error);
  });