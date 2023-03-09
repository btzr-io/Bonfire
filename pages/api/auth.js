import assert from "assert";
import { nanoid } from "nanoid";
import { pusher } from "@/lib/pusher";
import apiRoute from "@/lib/apiRoute";

function handler(req, res) {
  try {
    // Validate request
    const { socket_id, name } = req.body;
    assert(name && name.length);
    assert(socket_id && socket_id.length);
    // Create anonymous authentication
    const userData = { id: nanoid(), user_info: { name } };
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
