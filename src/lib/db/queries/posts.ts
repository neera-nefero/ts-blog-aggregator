import { db } from "..";
import { posts, feedFollows } from "../schema";
import { eq, lt, gte, ne, desc } from 'drizzle-orm';

export async function addPost(title: string, url: string, description: string, publishedAt: Date, feedId: string) {
    const [result] = await db
        .insert(posts)
        .values({ title: title, url: url, description: description, publishedAt: publishedAt, feedId: feedId })
        .returning();
    return result;
}

export async function getPostsForUser(userId: string, limit: number) {
    const result = await db
        .select()
        .from(posts)
        .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
        .where(eq(feedFollows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit);
    return result;
}
