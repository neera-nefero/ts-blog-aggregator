import { db } from "..";
import { feeds, users } from "../schema";
import { eq, lt, gte, ne } from 'drizzle-orm';
import { sql } from "drizzle-orm";

export type Feed = typeof feeds.$inferSelect;

export async function addFeed(name: string, url: string, user_id: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: user_id }).returning();
    return result;
}

export async function getFeed(url: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function getFeeds() {
    const result = await db.select().from(users).innerJoin(feeds, eq(users.id, feeds.userId));
    return result;
}

export async function getNextFeedToFetch() {
    const [result] = await db.select().from(feeds).orderBy(sql`${feeds.lastFetchedAt} asc nulls first`).limit(1);
    return result;
}

export async function markFeedFetched(fetchId: string) {
    const now = new Date()
    const [result] = await db.update(feeds).set({ lastFetchedAt: now, updatedAt: now }).where(eq(feeds.id, fetchId)).returning();
    return result;
}

