import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
};

export function setUser(userName: string) {
    const config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}

export function readConfig() {
    const file_content = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" });
    return validateConfig(JSON.parse(file_content));
}

function getConfigFilePath() {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config) {
    const rawConfig = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(rawConfig));
}

function validateConfig(rawConfig: any) {
    if (!rawConfig.db_url) {
        throw new Error("db_url is required in config file");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name ?? ""
    }
}
