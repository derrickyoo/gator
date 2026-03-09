import { fetchFeed } from "../lib/rss.js";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
  // if (args.length !== 1) {
  //   throw new Error(`usage: ${cmdName} <feed_url>`);
  // }

  const feedURL = args[0] ?? "https://www.wagslane.dev/index.xml";
  const RSSFeed = await fetchFeed(feedURL);

  console.log(JSON.stringify(RSSFeed, null, 2));
}
