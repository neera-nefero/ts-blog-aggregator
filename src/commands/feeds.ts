import { scrapeFeeds } from "../feed";
import { Feed, addFeed, getFeed, getFeeds } from "../lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from "../lib/db/queries/feeds_follows";
import { User } from "../lib/db/queries/users";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("agg requires a time between requests argument");
    }

    const timeBetweenRequests = parseDuration(args[0]);
    console.log(`Collecting feeds every ${args[0]}`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
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

function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (match === null) {
        throw new Error("bad format for time between requests argument")
    }

    const amount = parseInt(match[1], 10);

    switch (match[2]) {
        case "ms":
            return amount;
        case "s":
            return amount * 1000;
        case "m":
            return amount * 60 * 1000;
        case "h":
            return amount * 60 * 60 * 1000;
        default:
            throw new Error("bad format for time between requests argument");
    }
}

function handleError(err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error scraping feeds: ${message}`);
}