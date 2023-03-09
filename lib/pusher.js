import * as Pusher from "pusher";
export const pusher = Pusher.forURL(process.env.PUSHER_URL);

export async function findChannel(channel) {
  var channels = await getChannels();
  var formated = `presence-${channel}`;
  return channels[formated];
  // Fetch database
  for (const channelName in channels) {
    const channelsInfo = channels[channelName];
    // Channel is open
    if (channelsInfo.user_count) {
      return channelName;
    }
  }
}

export async function getChannels() {
  const res = await pusher.get({
    path: "/channels",
    params: {
      info: ["user_count"],
      filter_by_prefix: "presence-",
    },
  });
  if (res.status === 200) {
    const body = await res.json();
    const channelsInfo = body.channels;
    return channelsInfo;
  }
}
