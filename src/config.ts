import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(current_user_name: string): void {
    const actual_config = readConfig();
    actual_config.currentUserName = current_user_name;
    writeConfig(actual_config);
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), "/typescript/ts-blog-aggregator/.gatorconfig.json");
}

function writeConfig(cfg: Config): void {
    const translated_to_json = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(translated_to_json));
}

export function readConfig(): Config {
    const file_content = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" });
    return validateConfig(JSON.parse(file_content));
}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig.db_url) {
        throw new Error("missing db_url");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name || ""
    }
}
