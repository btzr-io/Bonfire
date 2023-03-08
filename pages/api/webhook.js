import assert from "assert";
import { nanoid } from "nanoid";
import { pusher } from "@/lib/pusher";
import NextCors from "nextjs-cors";

const METHODS = ["POST", "OPTIONS"];

export default async function handler(req, res) {
  // Filter methods
  if (!METHODS.includes(req.method)) {
    res.setHeader("Allow", METHODS.join(","));
    return res.status(405).send({ error: "Method Not Allowed" });
  }

  try {
    // Enable cors:
    // Run the cors middleware
    await NextCors(req, res, {
      origin: "*",
      method: ["POST"],
      optionsSuccessStatus: 200,
    });
    // Validate request
    return res.status(200);
  } catch {
    return res.status(400).send({ error: "Failed authentication" });
  }
}
