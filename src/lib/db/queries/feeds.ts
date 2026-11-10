import { db } from "..";
import { feeds } from "../schema";
import { eq, lt, gte, ne } from 'drizzle-orm';

export type Feed = typeof feeds.$inferSelect;

export async function addFeed(name: string, url: string, user_id: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: user_id }).returning();
    return result;
}