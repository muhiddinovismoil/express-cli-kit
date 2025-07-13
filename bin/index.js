#!/usr/bin/env node
import { generate } from "../src/commands/generate.js";

const [, , cmd, type, name] = process.argv;

if (cmd === "g" || cmd === "generate") {
    if (!type || !name) {
        console.log("❌ Usage: express-cli g <type> <name>");
        process.exit(1);
    }
    generate(type, name);
} else {
    console.log("❌ Unknown command.");
}
