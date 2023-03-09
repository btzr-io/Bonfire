import { pusher } from "@/lib/pusher";

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function handler(req, res) {
  try {
    req.rawBody = await buffer(req).toString("utf8");
    const webhook = pusher.webhook(req);
    // Validate webhook
    webhook.isValid();
    // ...
    const { events, time_ms } = webhook.getData();
    console.info(time_ms);
    res.status(200).send({ ok: true, time_ms, events });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "Invalid webhook" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute(handler, {
  cors: true,
  methods: ["POST"],
  rateLimit: false,
});
