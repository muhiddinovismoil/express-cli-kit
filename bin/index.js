#!/usr/bin/env node
import chalk from "chalk";
import path, { dirname } from "path";
import { existsSync, readFileSync } from "fs";
import { Command } from "commander";
import { fileURLToPath } from "url";
import {
    showSchematicListsTable,
    generate,
    showInfo,
    createNewApp,
} from "../src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkgPath = path.resolve(__dirname, "../package.json");

let pkg = {};
if (existsSync(pkgPath)) {
    pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
} else {
    console.log("⚠️  CLI package.json not found.");
    pkg.version = "0.0.0";
}

const program = new Command();

program
    .name("express-cli")
    .description("Express CLI tool to generate project components")
    .helpOption("-h, --help", "Display help for command")
    .version(
        pkg.version || "1.0.0",
        "-v, --version",
        "Display version information"
    )
    .helpCommand(false);

program
    .command("generate")
    .alias("g")
    .argument("<type>", "Type of component (controller, route, service, etc.)")
    .argument("[name]", "Name of the component")
    .description("Generate a new component for the Express application")
    .action((type, name) => {
        generate(type, name);
    });

program
    .command("info")
    .alias("i")
    .description("Display information about the CLI tool")
    .action(() => showInfo());

program
    .command("new")
    .alias("n")
    .argument("[name]", "Name of the new application")
    .description("Generate a new Express application")
    .action((name) => {
        createNewApp(name);
    });

program.on("command:*", ([cmd]) => {
    console.error(
        `\n${chalk.red("Error")}  Invalid command: ${chalk.yellow(cmd)}`
    );
    console.log(`See --help for a list of available commands.\n`);
    process.exit(1);
});

program.addHelpText("afterAll", () => {
    return `\n${chalk.bold("Schematics available on express-cli:")}\n${showSchematicListsTable()}`;
});

program.parse();
