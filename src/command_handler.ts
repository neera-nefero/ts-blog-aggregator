import { setUser, readConfig } from "./config";
import { User, createUser, getUser, resetUsers, getUsers } from "./lib/db/queries/users";
import { Feed, addFeed } from "./lib/db/queries/feeds";
import { fetchFeed } from "./feed";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("login requires a username argument");
    }
    const userName = args[0];

    const user = await getUser(userName);
    if (!user) {
        throw new Error(`user: ${userName} doesn't exists`);
    }

    setUser(userName);
    console.log(`user ${userName} has been set`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("register requires a username argument");
    }
    const userName = args[0];

    const user = await getUser(userName);
    if (user) {
        throw new Error(`user: ${userName} already exists`);
    }

    await createUser(userName);
    setUser(userName);
    console.log(`user ${userName} has been registered`);
    console.table(await getUser(userName));
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    await resetUsers();
    console.log("table users has been reset");
}

export async function handlerGetUsers(cmdName: string, ...args: string[]) {
    const users = await getUsers();
    if (!users) {
        throw new Error(`there are no users in the table`);
    }

    const config = readConfig();
    const logedUser = config.currentUserName;
    if (!logedUser) {
        throw new Error("user login required");
    }

    for (const user of users) {
        if (logedUser == user.name) {
            console.log(`* ${user.name} (current)`);
        } else {
            console.log(`* ${user.name}`);
        }
    }
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed));
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length <= 1) {
        throw new Error("addfeed requires name and url argument");
    }

    const config = readConfig();
    const logedUser = config.currentUserName;
    if (!logedUser) {
        throw new Error("user login required");
    }

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

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const command = registry[cmdName];
    if (command === undefined) {
        throw new Error(`no command found for ${cmdName}`);
    }
    await command(cmdName, ...args);
}

function printFeed(user: User, feed: Feed) {
    console.log(`user: ${user.name}`);
    console.log(`feed: ${feed.name}`);
    console.log(`url: ${feed.url}`);
}