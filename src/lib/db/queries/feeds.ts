import { db } from "../index.js";
import { feeds, NewFeed } from "../schema.js";

export async function addFeed(newFeed: NewFeed) {
  const [result] = await db.insert(feeds).values(newFeed).returning();

  return result;
}
