import { User, getUser } from "../lib/db/queries/users";
import { readConfig } from "../config";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;
export type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

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

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const config = readConfig();
        if (!config.currentUserName) {
            throw new Error(`User not configured`);
        }

        const logedUser = config.currentUserName;
        const user = await getUser(logedUser);
        if (!user) {
            throw new Error(`User ${logedUser} not found`);
        }
        return await handler(cmdName, user, ...args);
    };
}