import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Vite SPA bundles external fonts/icons
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Global API Rate Limiter
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Strict Auth Rate Limiter (Brute-Force Protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 login/register attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 15 minutes",
  },
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Apply global rate limiting to all /api/ endpoints
app.use("/api", globalApiLimiter);
app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/register", authLimiter);

// --------- routes -----------------

//  ------------------- import routes ----------------------

import userRouter from "./routes/user.routes.js";
import candidateRouter from "./routes/candidate.routes.js";
import recruiterRouter from "./routes/recruiter.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import { ErrorHandler } from "./middleware/Error.middleware.js";

//  --------------- health check endpoints ----------------
const healthCheckHandler = (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    message: "JobMatrix Server is active and healthy",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || "development",
  });
};

app.get("/health", healthCheckHandler);
app.get("/api/v1/health", healthCheckHandler);

//  --------------- routes declaration --------------------

app.use("/api/v1/users", userRouter);
app.use("/api/v1/candidates", candidateRouter);
app.use("/api/v1/recruiters", recruiterRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/notifications", notificationRouter);

// ----------------- Serve Frontend Static Assets & SPA Fallback -----------------
const clientDistPath = path.resolve(__dirname, "../../client/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.use((req, res, next) => {
    // If request starts with /api/, pass to next middleware (let 404 / ErrorHandler handle it)
    if (req.originalUrl.startsWith("/api/")) {
      return next();
    }
    // For all other GET requests (SPA client-side routing), serve index.html
    if (req.method === "GET") {
      return res.sendFile(path.join(clientDistPath, "index.html"));
    }
    next();
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "JobMatrix Backend API server is running. (Frontend dist not built. In development, open Vite dev server on port 5173).",
      health: "/api/v1/health",
      docs: "https://github.com/Parinay-Chauhan/JobMatrix",
    });
  });
}

// Global Error Handler Middleware
app.use(ErrorHandler);

export { app };

