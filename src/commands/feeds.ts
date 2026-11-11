import { fetchFeed } from "../feed";

import { Feed, addFeed, getFeed, getFeeds } from "../lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from "../lib/db/queries/feeds_follows";
import { User } from "../lib/db/queries/users";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed));
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length <= 1) {
        throw new Error("addfeed requires name and url argument");
    }

    const feedName = args[0];
    const feedUrl = args[1];

    const feed = await addFeed(feedName, feedUrl, user.id);
    await createFeedFollow(user.id, feed.id);

    console.log("Feed added");
    printFeed(user, feed);
}

export async function handlerGetFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();
    if (!feeds) {
        throw new Error(`there are no feeds in the table`);
    }

    for (const item of feeds) {
        console.log(`* ${item.feeds.name} - ${item.feeds.url} - ${item.users.name}`);
    }
}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("follow requires a url argument");
    }
    const feedUrl = args[0];

    const feed = await getFeed(feedUrl);
    if (!feed) {
        throw new Error(`feed not found with the url selected`);
    }

    const feedInfo = await createFeedFollow(user.id, feed.id);
    console.log(`Feed: ${feedInfo.feedName} - User: ${feedInfo.userName}`);
}

export async function handlerGetFeedFollowsForUser(cmdName: string, user: User, ...args: string[]) {
    const feeds = await getFeedFollowsForUser(user.id);

    console.log(`List of feeds followed by ${user.name}:`);
    for (const item of feeds) {
        console.log(`* ${item.feedName}`);
    }
}

export async function handlerUnfollowFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("unfollowfeed requires url argument");
    }

    const feedUrl = args[0];

    const feed = await getFeed(feedUrl);
    await deleteFeedFollow(user.id, feed.id);

    console.log("Feed unfollowed");
}

function printFeed(user: User, feed: Feed) {
    console.log(`user: ${user.name}`);
    console.log(`feed: ${feed.name}`);
    console.log(`url: ${feed.url}`);
}