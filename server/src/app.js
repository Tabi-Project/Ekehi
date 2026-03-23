const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { port, nodeEnv, allowedOrigins } = require("./config/env");
const apiRoutes = require("./routes/index");
const errorHandler = require("./middleware/errorHandler.middleware");
const { sendSuccess, sendError } = require("./utils/response.utils");

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman) in development
      if (!origin || nodeEnv === "development") return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

// Request logging
app.use(morgan(nodeEnv === "production" ? "combined" : "dev"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later.",
  },
});

app.use("/api/v1/auth", authLimiter);
app.use("/api/v1", generalLimiter);

// Health check (no rate limit, no auth)
app.get("/api/v1/health", (req, res) => {
  return sendSuccess(res, {
    status: 200,
    message: "Server is healthy",
    data: { status: "ok" },
  });
});

// API routes
app.use("/api/v1", apiRoutes);

// 404 handler
app.use((req, res) => {
  return sendError(res, {
    status: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Running on port ${port} in ${nodeEnv} mode`);
});

module.exports = app;
