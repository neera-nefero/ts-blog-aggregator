import { setUser } from "./config";
import { createUser, getUser, resetUsers } from "./lib/db/queries/users";

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