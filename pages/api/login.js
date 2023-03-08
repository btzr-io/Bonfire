import assert from "assert";
import { withIronSessionApiRoute } from "iron-session/next";
import { withSessionRoute } from "@/lib/session/route";
import { ERROR_RATE_LIMIT, ERROR_AUTHENTICATION } from "@/lib/errors";

import { applyRateLimit, getRateLimitMiddlewares } from "@/lib/applyRateLimit";

const middlewares = getRateLimitMiddlewares({
  limit: 5,
  windowMs: 60 * 60 * 1000,
  message: { error: ERROR_RATE_LIMIT },
});

export default withSessionRoute(handler);

async function handler(req, res) {
  // Only handle POST requests
  if (req.method != "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send({ error: "Method Not Allowed" });
  }
  // Rate limit middleware
  try {
    await applyRateLimit(middlewares, req, res);
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    return res.status(ERROR_RATE_LIMIT.code);
  }
  // Validate data
  try {
    let user = req.body.user;
    const password = req.body.password;
    // No credentials
    assert.notEqual(null, user);
    assert.notEqual(null, password);
    // Format username
    user = user.trim();
    // Invalid username
    assert.ok(user.length && user == process.env.BONFIRE_USER);
    // Invalid password
    assert.ok(password.length && password == process.env.BONFIRE_PASSWORD);
    // Create new session for user
    req.session.user = { name: user, admin: true };
    await req.session.save();
    return res.status(200).json({ ok: true });
  } catch (err) {
    // Authentication failed
    return res.status(ERROR_AUTHENTICATION.code).json({
      error: ERROR_AUTHENTICATION,
    });
  }
}
