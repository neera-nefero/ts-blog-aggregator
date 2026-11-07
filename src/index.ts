import { CommandsRegistry, handlerLogin, handlerRegister, registerCommand, runCommand } from "./command_handler";

async function main() {
    const commandsRegistry: CommandsRegistry = {};
    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);

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