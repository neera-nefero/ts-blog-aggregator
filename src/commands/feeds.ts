import { fetchFeed } from "../feed";
import { getLogedUser } from "../config";

import { Feed, addFeed, getFeeds } from "../lib/db/queries/feeds";
import { User, getUser } from "../lib/db/queries/users";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed));
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length <= 1) {
        throw new Error("addfeed requires name and url argument");
    }

    const logedUser = getLogedUser();
    const user = await getUser(logedUser);
    if (!user) {
        throw new Error("user not registered");
    }

    const feedName = args[0];
    const feedUrl = args[1];

    const feed = await addFeed(feedName, feedUrl, user.id);
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

//export async function handlerFollow(cmdName: string, ...args: string[]) {
//    if (args.length === 0) {
//        throw new Error("follow requires a url argument");
//    }
//    const feedUrl = args[0];
//
//    const logedUser = getLogedUser();
//
//    await createFeedFollow()
//    setUser(userName);
//    console.log(`user ${userName} has been registered`);
//    console.table(await getUser(userName));
//}

function printFeed(user: User, feed: Feed) {
    console.log(`user: ${user.name}`);
    console.log(`feed: ${feed.name}`);
    console.log(`url: ${feed.url}`);
}