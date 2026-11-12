import { XMLParser } from "fast-xml-parser";
import { markFeedFetched, getNextFeedToFetch } from "./lib/db/queries/feeds";

type RssFeed = {
    channel: Channel
};

type Channel = {
    title: string,
    link: string,
    description: string,
    item: FeedItem[]
};

type FeedItem = {
    title: string,
    link: string,
    description: string,
    pubDate: string
};

export async function fetchFeed(feedUrl: string): Promise<RssFeed> {
    const response = await fetch(feedUrl, { headers: { "User-Agent": "gator" } });
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.text();
    const parsedData = getParsedData(data);

    validateChannel(parsedData.rss);

    let validItems: FeedItem[] = [];
    if (Array.isArray(parsedData.rss.channel.item)) {
        for (const item of parsedData.rss.channel.item) {
            if (validateItem(item)) {
                validItems.push(item);
            }
        }
    } else {
        if (validateItem(parsedData.rss.channel.item)) {
            validItems.push(parsedData.rss.channel.item);
        }
    }

    return {
        channel: {
            title: parsedData.rss.channel.title,
            link: parsedData.rss.channel.link,
            description: parsedData.rss.channel.description,
            item: validItems,
        }
    }
}

export async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed) {
        console.log("No feeds found!");
        return;
    }

    const feed = await fetchFeed(nextFeed.url);
    await markFeedFetched(nextFeed.id);

    for (const item of feed.channel.item) {
        console.log(`Feed title: ${item.title}`);
    }
}

function getParsedData(data: string) {
    const options = {
        processEntities: false
    };
    const parser = new XMLParser(options);
    return parser.parse(data);
}

function validateChannel(rss: RssFeed) {
    if (!rss.channel) {
        throw new Error("Parse error: Missing channel");
    }
    if (!rss.channel.title) {
        throw new Error("Parse error: Missing title");
    }
    if (!rss.channel.link) {
        throw new Error("Parse error: Missing link");
    }
    if (!rss.channel.description) {
        throw new Error("Parse error: Missing description");
    }
    if (!rss.channel.item) {
        throw new Error("Parse error: Missing items");
    }

    return true;
}

function validateItem(item: FeedItem) {
    if (!item.title) {
        return false;
    }
    if (!item.description) {
        return false;
    }
    if (!item.link) {
        return false;
    }
    if (!item.pubDate) {
        return false;
    }

    return true;
}