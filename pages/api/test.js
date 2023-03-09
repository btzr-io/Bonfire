import { getChannels } from "@/lib/pusher";
import apiRoute from "@/lib/apiRoute";

async function handler(req, res) {
  try {
    var data = await getChannels();
    res.status(200).send({ data: data });
  } catch {
    return res.status(400).send({ error: "Failed authentication" });
  }
}

export default apiRoute(handler, {
  cors: true,
  methods: ["GET"],
  rateLimit: true,
});
