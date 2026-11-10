import {
    CommandsRegistry,
    handlerLogin,
    handlerRegister,
    handlerReset,
    handlerGetUsers,
    handlerAgg,
    handlerAddFeed,
    registerCommand,
    runCommand
}
    from "./command_handler";

async function main() {
    const commandsRegistry: CommandsRegistry = {};
    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", handlerGetUsers);
    registerCommand(commandsRegistry, "agg", handlerAgg);
    registerCommand(commandsRegistry, "addfeed", handlerAddFeed);

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