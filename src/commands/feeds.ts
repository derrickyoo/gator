import { readConfig } from "../config.js";
import { createFeedFollow } from "../lib/db/queries/feed-follows.js";
import { createFeed, getFeeds } from "../lib/db/queries/feeds.js";
import { getUser, getUserById } from "../lib/db/queries/users.js";
import { Feed, User } from "../lib/db/schema.js";
import { printFeedFollow } from "./feed-follows.js";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const config = readConfig();
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <feed_url>`);
  }

  const [name, url] = args;
  const feed = await createFeed({
    name,
    url,
    userId: user.id,
  });
  if (!feed) {
    throw new Error("failed to create feed");
  }
  const feedFollow = await createFeedFollow(user.id, feed.id);
  printFeedFollow(user.name, feedFollow.feedName);

  console.log("🎉 feed created sucessfully");
  printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function handlerListFeeds(_: string) {
  const feeds = await getFeeds();

  if (feeds.length === 0) {
    console.log("feeds not found");
    return;
  }

  console.log(`Found %d feeds:\n`, feeds.length);

  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`failed to find user for feed ${feed.id}`);
    }
    printFeed(feed, user);
    console.log(`=====================================`);
  }
}
