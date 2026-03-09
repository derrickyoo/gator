import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feed-follows.js";
import { getFeedByURL } from "../lib/db/queries/feeds.js";

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

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const feedURL = args[0];
  let feed = await getFeedByURL(feedURL);
  if (!feed) {
    throw new Error(`Feed not found for url: ${feedURL}`);
  }

  const result = await deleteFeedFollow(feed.id, user.id);
  if (!result) {
    throw new Error(`failed to unfollow feed: ${feedURL}`);
  }

  console.log(`%s unfollowed successfully!`, feed.name);
}
