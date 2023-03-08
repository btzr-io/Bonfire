import NextCors from "nextjs-cors";
import { ERROR_RATE_LIMIT } from "@/lib/errors";
import { applyRateLimit, getRateLimitMiddlewares } from "@/lib/applyRateLimit";

const middlewares = getRateLimitMiddlewares({
  limit: 3,
  windowMs: 6000,
  message: { error: ERROR_RATE_LIMIT },
});

export default function apiRouteWrapper(
  handler,
  { cors = false, methods = ["GET", "POST"], rateLimit = true }
) {
  return async function wrapperHandler(req, res) {
    let allowMethods = methods;
    // Only for cors:
    if (cors) {
      allowMethods.push("OPTIONS");
    }

    // Filter methods
    if (methods.length && !allowMethods.includes(req.method)) {
      res.setHeader("Allow", allowMethods.join(","));
      return res.status(405).send({ error: "Method Not Allowed" });
    }
    // Check cors
    if (cors) {
      await NextCors(req, res, {
        origin: "*",
        method: methods,
        optionsSuccessStatus: 200,
      });
    }
    // Rate limit
    if (rateLimit) {
      try {
        await applyRateLimit(middlewares, req, res);
      } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(ERROR_RATE_LIMIT.code).send(ERROR_RATE_LIMIT);
      }
    }
    return handler(req, res);
  };
}
