import assert from "assert";
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../lib/config";
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

export default withIronSessionApiRoute(handler, ironOptions);

async function handler(req, res) {
  // Rate limit middleware
  try {
    await applyRateLimit(middlewares, req, res);
  } catch (error) {
    res.headers.set("Content-Type", "application/json");
    return res.status(429);
  }
  // Validate data
  try {
    let user = req.body.user;
    const password = req.body.password;
    // No credentials
    assert.notEqual(null, user, ERROR_INVALID_AUTHENTICATION);
    assert.notEqual(null, password, ERROR_INVALID_AUTHENTICATION);
    // Format username
    user = user.trim();
    // Invalid username
    assert.ok(
      user.length && user == process.env.BONFIRE_USER,
      ERROR_INVALID_AUTHENTICATION
    );
    // Invalid password
    assert.ok(
      password.length && password == process.env.BONFIRE_PASSWORD,
      ERROR_INVALID_AUTHENTICATION
    );
    // Create new session for user
    req.session.user = { name: user, admin: true };
    await req.session.save();
    return res.status(200).json({ ok: true });
  } catch (error) {
    // Authentication failed
    return res.status(400).json({ error: error.message });
  }
}
