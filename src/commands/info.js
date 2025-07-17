import os from "os";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getCliVersion() {
    try {
        const pkgPath = resolve(__dirname, "../../package.json");
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
        return pkg.version || "Unknown";
    } catch {
        return "Unknown";
    }
}

export function showInfo() {
    const cliVersion = getCliVersion();
    const cwd = process.cwd();
    const projectPkgPath = join(cwd, "package.json");

    const osVersion = `${os.type()} ${os.release()}`;
    const nodeVersion = process.version;

    let npmVersion = "Unknown";
    try {
        npmVersion = execSync("npm -v").toString().trim();
    } catch {}

    const banner = figlet.textSync("express-cli", { font: "Slant" });
    console.log(gradient.vice(banner));
    console.log("");

    console.log(chalk.bold("[🖥️  System Information]"));
    console.log(chalk.cyan("OS Version     : ") + osVersion);
    console.log(chalk.cyan("NodeJS Version : ") + nodeVersion);
    console.log(chalk.cyan("NPM Version    : ") + npmVersion);

    console.log("\n" + chalk.bold("[🚀 Express CLI]"));
    console.log(chalk.cyan("CLI Version    : ") + cliVersion);
    console.log("");

    if (existsSync(projectPkgPath)) {
        console.log(chalk.green("📦 You are in a project directory."));
    } else {
        console.log(
            chalk.yellow(
                "📦 You are not in a recognized Express project directory."
            )
        );
    }

    console.log("");
}
