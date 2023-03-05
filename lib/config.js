export const ironOptions = {
  cookieName: "bonfire_session",
  password: process.env.BONFIRE_SECRET,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
