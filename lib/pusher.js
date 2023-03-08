import * as Pusher from "pusher";

const PORT = 443;
const USE_TLS = process.env.NODE_ENV === "production";
export const pusher = Pusher.forURL(process.env.PUSHER_URL);
