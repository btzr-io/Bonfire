import assert from "assert";
import { pusher } from "@/lib/pusher";
import apiRoute from "@/lib/apiRoute";
import { SCHEMA } from "@/lib/db/schema";
import { runQuery } from "@/lib/db/connection";

async function handler(req, res) {
  try {
    // Validate request params
    const { socket_id, channel_name } = req.body;
    assert(socket_id && socket_id.length);
    // Channel
    if (channel_name) assert(channel_name.length);
    // Create anonymous authentication
    const auth = pusher.authorizeChannel(socket_id, channel_name);
    return res.status(200).send(auth);
  } catch {
    return res.status(400).send({ error: "Failed authorization" });
  }
}

export default apiRoute(handler, {
  cors: true,
  methods: ["POST"],
  rateLimit: true,
});
