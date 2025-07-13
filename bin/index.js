#!/usr/bin/env node
import { Command } from "commander";
import { generate } from "../src/commands/generate.js";

const program = new Command();

program
    .name("express-cli")
    .description("Express CLI tool to generate project components")
    .version("1.0.0");

program
    .command("generate")
    .alias("g")
    .argument("<type>", "Type of component (controller, route, service, etc.)")
    .argument("<name>", "Name of the component")
    .action((type, name) => {
        generate(type, name);
    });

program.parse();
