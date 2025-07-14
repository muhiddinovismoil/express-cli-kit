#!/usr/bin/env node
import { Command } from "commander";
import { generate } from "../src/commands/generate.js";
import { readFileSync } from "fs";
import { join } from "path";
import chalk from "chalk";

const program = new Command();

const pkg = JSON.parse(
    readFileSync(join(process.cwd(), "package.json"), "utf8")
);

program
    .name("express-cli")
    .description("Express CLI tool to generate project components")
    .helpOption("-h, --help", "Display help for command")
    .version(pkg.version, "-v, --version", "Display version information")
    .helpCommand(false);

program
    .command("generate")
    .alias("g")
    .argument("<type>", "Type of component (controller, route, service, etc.)")
    .argument("<name>", "Name of the component")
    .description(
        "Generate a new component for the Express application (controller, route, service, etc.)"
    )
    .action((type, name) => {
        generate(type, name);
    });

program.command("info").alias("i").description();

program.on("command:*", ([cmd]) => {
    console.error(
        `\n${chalk.red("Error")}  Invalid command: ${chalk.yellow(cmd)}`
    );
    console.log(`See --help for a list of available commands.\n`);
    process.exit(1);
});

program.parse();
