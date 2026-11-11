import { setUser } from "../config";
import { User, createUser, getUser, resetUsers, getUsers } from "../lib/db/queries/users";

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

export async function handlerGetUsers(cmdName: string, user: User, ...args: string[]) {
    const users = await getUsers();
    if (!users) {
        throw new Error(`there are no users in the table`);
    }

    for (const item of users) {
        if (user.name == item.name) {
            console.log(`* ${item.name} (current)`);
        } else {
            console.log(`* ${item.name}`);
        }
    }
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    await resetUsers();
    console.log("table users has been reset");
}
