import assert from "assert";
import { nanoid } from "nanoid";
import { pusher } from "@/lib/pusher";
import apiRoute from "@/lib/apiRoute";

function handler(req, res) {
  return res.status(200).send({ ok: true });
  try {
    // Validate request params
    const { socket_id, channel_name } = req.body;
    assert(socket_id && socket_id.length);
    assert(channel_name && channel_name.length);
    // Create anonymous authentication
    const userData = { id: nanoid() };
    const auth = pusher.authorizeChannel(socket_id, channel_name);
    return res.status(200).send(auth);
  } catch {
    return res.status(400).send({ error: "Failed authentication" });
  }
}

export default apiRoute(handler, {
  cors: true,
  methods: ["POST"],
  rateLimit: true,
});
