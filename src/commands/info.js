import os from "os";
import { execSync } from "child_process";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export function showInfo() {
    const pkgPath = join(process.cwd(), "package.json");
    let cliVersion = "1.0.0";
    try {
        const rootPkg = JSON.parse(
            readFileSync(new URL("../../package.json", import.meta.url))
        );
        cliVersion = rootPkg.version;
    } catch {}
    const osVersion = `${os.type()} ${os.release()}`;
    const nodeVersion = process.version;
    let npmVersion = "Unknown";
    try {
        npmVersion = execSync("npm -v").toString().trim();
    } catch {}
    const banner = figlet.textSync("express-cli", { font: "Slant" });
    console.log(gradient.vice("\n" + banner));
    console.log(chalk.bold("[System Information]"));
    console.log(chalk.cyan("OS Version     : ") + osVersion);
    console.log(chalk.cyan("NodeJS Version : ") + nodeVersion);
    console.log(chalk.cyan("NPM Version    : ") + npmVersion);
    console.log("\n" + chalk.bold("[Express CLI]"));
    console.log(chalk.cyan("CLI Version    : ") + cliVersion);
    console.log("");
    if (existsSync(pkgPath)) {
        console.log(chalk.green("📦 You are in a project directory."));
    } else {
        console.log(
            chalk.yellow(
                "📦 You are not in a recognized Express project directory."
            )
        );
    }
}
