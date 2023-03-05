// https://kittygiraudel.com/2022/05/16/rate-limit-nextjs-api-routes/
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const applyMiddleware = (middleware) => (request, response) =>
  new Promise((resolve, reject) => {
    middleware(request, response, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });

export const getIP = (request) =>
  request.ip ||
  request.headers["x-forwarded-for"] ||
  request.headers["x-real-ip"] ||
  request.connection.remoteAddress;

const default_config = {
  limit: 10,
  windowMs: 60 * 1000,
  delayAfter: Math.round(10 / 2),
  delayMs: 500,
};

export const getRateLimitMiddlewares = (config = {}) => {
  if (config) {
    config = { ...default_config, ...config };
  }

  return [
    slowDown({
      delayMs: config.delayMs,
      windowMs: config.windowMs,
      delayAfter: config.delayAfter,
      keyGenerator: getIP,
    }),
    rateLimit({
      max: config.limit,
      message: config.message,
      windowMs: config.windowMs,
      keyGenerator: getIP,
    }),
  ];
};

export async function applyRateLimit(middlewares, request, response) {
  await Promise.all(
    middlewares
      .map(applyMiddleware)
      .map((middleware) => middleware(request, response))
  );
}
