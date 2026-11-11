import { CommandsRegistry, registerCommand, runCommand } from "./commands/command_handler";
import { handlerLogin, handlerRegister, handlerReset, handlerGetUsers } from "./commands/users";
import { handlerAgg, handlerAddFeed, handlerGetFeeds } from "./commands/feeds";

async function main() {
    const commandsRegistry: CommandsRegistry = {};
    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", handlerGetUsers);
    registerCommand(commandsRegistry, "agg", handlerAgg);
    registerCommand(commandsRegistry, "addfeed", handlerAddFeed);
    registerCommand(commandsRegistry, "feeds", handlerGetFeeds);

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