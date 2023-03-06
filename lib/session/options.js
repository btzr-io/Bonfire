export const sessionOptions = {
  cookieName: "bonfire_session",
  password: process.env.BONFIRE_SECRET,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function validateSessionOptions() {
  const { password, cookieName } = sessionOptions;
  if (!cookieName || typeof cookieName != "string" || !cookieName.length) {
    throw new Error("Invalid cookie name for iron session.");
  }
  if (
    !password ||
    typeof password != "string" ||
    !password.length ||
    password.length < 32
  ) {
    throw new Error("Invalid cookie password for iron session.");
  }
}
