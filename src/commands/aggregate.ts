import { getNextFeedToFetch } from "../lib/db/queries/feeds.js";
import type { Feed } from "../lib/db/schema.js";
import { fetchFeed } from "../lib/rss.js";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
  // if (args.length !== 1) {
  //   throw new Error(`usage: ${cmdName} <feed_url>`);
  // }

  const feedURL = args[0] ?? "https://www.wagslane.dev/index.xml";
  const RSSFeed = await fetchFeed(feedURL);

  console.log(JSON.stringify(RSSFeed, null, 2));
}

async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log(`no feeds to fetch`);
    return;
  }
  console.log(`found a feed to fetch: ${feed.name}`);
  await scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
  const feedData = await fetchFeed(feed.url);

  const items = feedData.channel.item;
  for (const item of items) {
    console.log(`found post: %s`, item.title);
  }

  console.log(
    `feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}
