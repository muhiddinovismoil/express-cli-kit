import inquirer from "inquirer";
import {
    generateNewApplicationWithNpm,
    generateNewApplicationWithPnpm,
    generateNewApplicationWithYarn,
} from "../functions/index.js";

export async function createNewApp(name) {
    try {
        if (!name) {
            console.log("✨  We will scaffold your app in a few seconds..\n");
            const response = await inquirer.prompt({
                type: "input",
                name: "name",
                message: "What is the name of your new app?",
                default: "express-app",
                validate: (input) => {
                    if (!input) {
                        return "App name cannot be empty.";
                    }
                    return true;
                },
            });
            name = response.name;
        }
        const response2 = await inquirer.prompt({
            message: "Which package manager would you ❤️ to use?:",
            name: "packageManager",
            type: "list",
            choices: ["npm", "yarn", "pnpm"],
            default: "npm",
        });
        const packageManager = response2.packageManager;
        switch (packageManager) {
            case "npm":
                await generateNewApplicationWithNpm(name);
                break;
            case "pnpm":
                await generateNewApplicationWithPnpm(name);
                break;
            case "yarn":
                await generateNewApplicationWithYarn(name);
                break;
        }
    } catch (error) {
        process.exit(1);
    }
}
