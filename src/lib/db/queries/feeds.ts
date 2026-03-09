import { db } from "../index.js";
import { feeds, NewFeed } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createFeed(feed: NewFeed) {
  const result = await db.insert(feeds).values(feed).returning();

  return firstOrUndefined(result);
}
