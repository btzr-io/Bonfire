import { getIronSession } from "iron-session/edge";
import { sessionOptions, validateSessionOptions } from "./options";

export default async function getSession(req, res) {
  try {
    validateSessionOptions();
    const session = await getIronSession(req, res, sessionOptions);
    return session;
    // return session;
  } catch (error) {
    return;
  }
}
