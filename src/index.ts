import { Config, readConfig, setUser } from "./config";

function main() {
    setUser("Neera");
    const config_file: Config = readConfig();

    console.log(config_file);
}

main();