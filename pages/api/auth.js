import assert from "assert";
import { nanoid } from "nanoid";
import { pusher } from "@/lib/pusher";

function handler(req, res) {
  try {
    // Validate request
    const { socket_id } = req.body;
    assert(socket_id && socket_id.length);
    // Create anonymous authentication
    const userData = { id: nanoid() };
    const auth = pusher.authenticateUser(socket_id, userData);
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
