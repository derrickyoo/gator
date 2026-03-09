import { readConfig } from "../config.js";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feed-follows.js";
import { getFeedByURL } from "../lib/db/queries/feeds.js";

import { getUser } from "../lib/db/queries/users.js";
import { User } from "../lib/db/schema.js";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error("usage: follow <feed_url>");
  }
  const feedURL = args[0];
  const feed = await getFeedByURL(feedURL);
  if (!feed) {
    throw new Error(`feed ${feedURL} not found`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  if (!feedFollow) {
    throw new Error("failed to follow feed");
  }

  console.log("🎉 follow feed successful");
  printFeedFollow(feedFollow.username, feedFollow.feedName);
}

export async function handlerListFeedFollows(
  _: string,
  user: User,
  __: string,
) {
  const feedFollows = await getFeedFollowsForUser(user.id);
  if (feedFollows.length === 0) {
    console.log(`No feed follows found for this user.`);
    return;
  }

  console.log(`Feed follows for user %s:`, user.id);
  for (let ff of feedFollows) {
    console.log(`* %s`, ff.feedname);
  }
}

export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:          ${username}`);
  console.log(`* Feed:          ${feedname}`);
}
