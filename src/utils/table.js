import chalk from "chalk";
import Table from "cli-table3";

export function showSchematicListsTable() {
    const schematics = [
        {
            name: "controller",
            alias: "co",
            description: "Generate a controller declaration",
        },
        {
            name: "middleware",
            alias: "mi",
            description: "Generate a middleware declaration",
        },
        {
            name: "route",
            alias: "r",
            description: "Generate a new route declaration",
        },
        {
            name: "service",
            alias: "s",
            description: "Generate a service declaration",
        },
        {
            name: "model",
            alias: "mo",
            description: "Generate a model declaration",
        },
        {
            name: "resourse",
            alias: "res",
            description: "Generate a new CRUD resource",
        },
    ];
    const table = new Table({
        head: [
            chalk.bold.red("name"),
            chalk.bold.red("alias"),
            chalk.bold.red("description"),
        ],
        colWidths: [15, 10, 50],
        style: { head: [] },
        chars: {
            top: "─",
            "top-mid": "┬",
            "top-left": "┌",
            "top-right": "┐",
            bottom: "─",
            "bottom-mid": "┴",
            "bottom-left": "└",
            "bottom-right": "┘",
            left: "│",
            "left-mid": "",
            mid: "",
            "mid-mid": "",
            right: "│",
            "right-mid": "",
            middle: "│",
        },
    });

    schematics.forEach((item) => {
        table.push([
            chalk.greenBright(item.name),
            chalk.cyanBright(item.alias),
            item.description,
        ]);
    });

    return table.toString();
}
