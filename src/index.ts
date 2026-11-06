import { CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./command_handler";

function main() {
    const commandsRegistry: CommandsRegistry = {};
    registerCommand(commandsRegistry, "login", handlerLogin);

    const rawArguments = process.argv.slice(2);
    if (rawArguments.length === 0) {
        throw new Error("it is required arguments");
    }

    const inputCommand = rawArguments[0];
    const inputArguments = rawArguments.slice(1);

    runCommand(commandsRegistry, inputCommand, ...inputArguments);
}

main();