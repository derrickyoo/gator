import { fetchFeed } from "../lib/rss.js";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <URL>`);
  }

  const feedURL = args[0];
  const RSSFeed = await fetchFeed(feedURL);

  console.log(RSSFeed);
}
