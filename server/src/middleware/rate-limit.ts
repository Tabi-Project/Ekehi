import rateLimit from "express-rate-limit";

const WINDOW_MS = 2 * 60 * 1000;

const sharedOptions = {
  windowMs: WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
} as const;

export const generalLimiter = rateLimit({
  ...sharedOptions,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    data: null,
  },
});

export const authLimiter = rateLimit({
  ...sharedOptions,
  max: 10,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later.",
    data: null,
  },
});
