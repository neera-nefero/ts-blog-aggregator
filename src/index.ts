import { CommandsRegistry, registerCommand, runCommand, middlewareLoggedIn } from "./commands/command_handler";
import { handlerLogin, handlerRegister, handlerReset, handlerGetUsers } from "./commands/users";
import { handlerAgg, handlerAddFeed, handlerGetFeeds, handlerFollow, handlerGetFeedFollowsForUser } from "./commands/feeds";

async function main() {
    const commandsRegistry: CommandsRegistry = {};
    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", middlewareLoggedIn(handlerGetUsers));
    registerCommand(commandsRegistry, "agg", handlerAgg);
    registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(commandsRegistry, "feeds", handlerGetFeeds);
    registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerGetFeedFollowsForUser));

    const rawArguments = process.argv.slice(2);
    if (rawArguments.length === 0) {
        throw new Error("it is required arguments");
    }

    const inputCommand = rawArguments[0];
    const inputArguments = rawArguments.slice(1);

    await runCommand(commandsRegistry, inputCommand, ...inputArguments);

    process.exit(0);
}

main();