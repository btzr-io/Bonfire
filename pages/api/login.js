import {
  getIP,
  applyRateLimit,
  getRateLimitMiddlewares,
} from "../../lib/applyRateLimit.js";

const ERROR_RATE_LIMIT = "Stop Right There, Criminal Scum!";
const ERROR_INVALID_AUTHENTICATION = "Invalid password or username.";

const middlewares = getRateLimitMiddlewares({
  limit: 5,
  windowMs: 60 * 60 * 1000,
  message: { error: ERROR_RATE_LIMIT },
});

export default async function handler(req, res) {
  // Rate limit ( 3 request per minute )

  try {
    await applyRateLimit(middlewares, req, res);
  } catch (error) {
    res.headers.set("Content-Type", "application/json");
    return res.status(429);
  }

  // Validate data
  let validated = false;
  try {
    let user = req.body.user;
    let password = req.body.password;

    // No credentials
    if (
      !user ||
      !password ||
      typeof user != "string" ||
      typeof password != "string"
    ) {
      throw new Error(ERROR_INVALID_AUTHENTICATION);
    }

    // Format username
    user = user.trim();

    if (!user.length || !password.length) {
      throw new Error(ERROR_INVALID_AUTHENTICATION);
    }

    if (
      user != process.env.BONFIRE_USER ||
      password != process.env.BONFIRE_PASSWORD
    ) {
      throw new Error(ERROR_INVALID_AUTHENTICATION);
    }

    validated = true;
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({});
}
