import { db } from "../index.js";
import { NewPost, posts } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createPost(post: NewPost) {
  const result = await db.insert(posts).values(post).returning();
  return firstOrUndefined(result);
}
