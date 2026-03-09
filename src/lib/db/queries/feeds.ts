import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { feeds, type NewFeed } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createFeed(feed: NewFeed) {
  const result = await db.insert(feeds).values(feed).returning();

  return firstOrUndefined(result);
}

export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedByURL(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}
