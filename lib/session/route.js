import { sessionOptions, validateSessionOptions } from "./options";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { ERROR_SECURITY_MISCONFIGURATION } from "@/lib/errors.js";

function errorHandler(req, res) {
  res.status(ERROR_SECURITY_MISCONFIGURATION.code).json({
    error: ERROR_SECURITY_MISCONFIGURATION,
  });
}

export function withSessionRoute(handler) {
  try {
    validateSessionOptions();
    return withIronSessionApiRoute(handler, sessionOptions);
  } catch (error) {
    return errorHandler;
  }
}
