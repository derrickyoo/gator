import {
  getNextFeedToFetch,
  markFeedFetched,
} from "../lib/db/queries/feeds.js";
import { createPost } from "../lib/db/queries/posts.js";
import type { Feed, NewPost } from "../lib/db/schema.js";
import { fetchFeed } from "../lib/rss.js";
import { parseDuration } from "../lib/time.js";

export async function handlerAggregate(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const time = args[0];
  const timeBetweenRequests = parseDuration(time);
  console.log(`Collecting feeds every ${time}...`);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
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
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);

  const items = feedData.channel.item;
  for (const item of items) {
    console.log(`found post: %s`, item.title);
    for (let item of feedData.channel.item) {
      console.log(`Found post: %s`, item.title);

      const now = new Date();

      await createPost({
        url: item.link,
        feedId: feed.id,
        title: item.title,
        createdAt: now,
        updatedAt: now,
        description: item.description,
        publishedAt: new Date(item.pubDate),
      } satisfies NewPost);
    }
  }

  console.log(
    `feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`,
  );
}
