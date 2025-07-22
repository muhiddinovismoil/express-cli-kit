import ora from "ora";
import path, { resolve, dirname } from "path";
import chalk from "chalk";
import fs from "fs/promises";
import { execSync, exec } from "child_process";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { logCreate } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function renderTemplateFile(templateName, targetPath, data = {}) {
    const templatePath = resolve(
        __dirname,
        "../templates/application",
        templateName + ".ejs"
    );
    const content = await ejs.renderFile(templatePath, data);
    await fs.writeFile(targetPath, content);
    const size = Buffer.byteLength(content, "utf8");
    logCreate(path.relative(process.cwd(), targetPath), size);
}

async function renderTemplates(projectName) {
    const projectPath = path.resolve(process.cwd(), projectName);

    const folders = [
        "src/controller",
        "src/routes",
        "src/service",
        "src/middleware",
        "src/utils",
        "src/config",
    ];

    for (const folder of folders) {
        await fs.mkdir(path.join(projectPath, folder), { recursive: true });
    }

    await renderTemplateFile("app", path.join(projectPath, "src/app.js"));
    await renderTemplateFile("server", path.join(projectPath, "server.js"));
    await renderTemplateFile(
        "main-routes",
        path.join(projectPath, "src/routes/main.routes.js")
    );
    await renderTemplateFile(
        "app.route",
        path.join(projectPath, "src/routes/app.route.js")
    );
    await renderTemplateFile(
        "app.controller",
        path.join(projectPath, "src/controller/app.controller.js")
    );
    await renderTemplateFile(
        "app.service",
        path.join(projectPath, "src/service/app.service.js")
    );
    await renderTemplateFile(
        "config",
        path.join(projectPath, "src/config/config.js")
    );

    const foldersWithIndex = [
        "controller",
        "routes",
        "service",
        "middleware",
        "utils",
    ];
    for (const folder of foldersWithIndex) {
        const dirPath = path.join(projectPath, "src", folder);
        const files = await fs.readdir(dirPath);
        const exportLines = files
            .filter((f) => f !== "index.js" && f.endsWith(".js"))
            .map((f) => `export * from './${f}';`)
            .join("\n");

        await fs.writeFile(
            path.join(dirPath, "index.js"),
            exportLines || "// TODO: Add exports"
        );
    }

    await renderTemplateFile(
        "package.json",
        path.join(projectPath, "package.json"),
        { appName: projectName }
    );
    await renderTemplateFile("README.md", path.join(projectPath, "README.md"), {
        appName: projectName,
    });
    await renderTemplateFile(
        "prettierc",
        path.join(projectPath, ".prettierrc")
    );
    await fs.writeFile(
        path.join(projectPath, ".gitignore"),
        "node_modules\n.env\n"
    );
    execSync("npx gitignore node", {
        cwd: projectPath,
    });
    await renderTemplateFile(".env", path.join(projectPath, ".env"));
    await renderTemplateFile(
        ".env.example",
        path.join(projectPath, ".env.example")
    );
}

async function generateProject(projectName, manager) {
    const projectPath = path.resolve(process.cwd(), projectName);

    const scaffoldSpinner = ora(
        `⠴ Scaffolding ${projectName} with ${manager}...\n`
    ).start();

    try {
        scaffoldSpinner.succeed(
            chalk.green(`Scaffolded ${projectName} files.`)
        );
        await renderTemplates(projectName);

        const installSpinner = ora({
            text: chalk.cyan(`Installing dependencies with ${manager}...`),
            spinner: "dots",
        }).start();
        console.log();

        const commandMap = {
            npm: "npm install express dotenv prettier",
            pnpm: "npx pnpm add express dotenv prettier",
            yarn: "npx yarn add express dotenv prettier",
        };

        exec(commandMap[manager], {
            cwd: projectPath,
        });
        exec("git init .", {
            cwd: projectPath,
        });
        installSpinner.succeed(
            chalk.green(
                `Project ${projectName} created successfully with ${manager}! 🚀`
            )
        );
        console.log();
        console.log(chalk.bold.cyan("✨ To get started:"));
        console.log(`  ${chalk.green("$")} cd ${projectName}`);
        console.log(`  ${chalk.green("$")} ${manager} run dev`);
        console.log();

        console.log(
            chalk.gray(
                "───────────────────────────────────────────────────────────"
            )
        );
        console.log(
            chalk.bold("📣 GitHub: ") +
                chalk.underline.cyan(
                    "https://github.com/muhiddinovismoil/express-cli"
                )
        );
        console.log(
            chalk.bold("☕ Support me: ") +
                chalk.underline.red("https://t.me/codingwithismoil")
        );
        console.log(
            chalk.gray(
                "───────────────────────────────────────────────────────────"
            )
        );
    } catch (error) {
        scaffoldSpinner.fail(chalk.red(`Failed to scaffold ${projectName}.`));
        console.error(error);
    }
}

export async function generateNewApplicationWithNpm(name) {
    await generateProject(name, "npm");
}
export async function generateNewApplicationWithPnpm(name) {
    await generateProject(name, "pnpm");
}
export async function generateNewApplicationWithYarn(name) {
    await generateProject(name, "yarn");
}
