import * as Pusher from "pusher";
export const pusher = Pusher.forURL(process.env.PUSHER_URL);
