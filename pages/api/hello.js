// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const Pusher = require("pusher");

const {
  PUSHER_KEY: key,
  PUSHER_APP_ID: appId,
  PUSHER_SECRET: secret,
  PUSHER_CLUSTER: cluster,
} = process.env;

const channels = new Pusher({
  key,
  appId,
  secret,
  cluster,
});

export default function handler(req, res) {
  res
    .status(200)
    .json({ name: "John does" })
    .error((error) => {
      console.info(error);
    });
}
