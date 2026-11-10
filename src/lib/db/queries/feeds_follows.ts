import { db } from "..";
import { users, feeds, feedFollows } from "../schema";
import { eq } from 'drizzle-orm';

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId: userId, feedId: feedId }).returning();

    const [result] = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        feedName: feeds.name,
        feedUrl: feeds.url,
        userName: users.name
    })
        .from(feedFollows)
        .innerJoin(users, eq(users.id, feedFollows.userId))
        .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
        .where(eq(feedFollows.id, newFeedFollow.id));

    return result;
}
