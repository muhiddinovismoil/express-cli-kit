import fs from "fs";
import ejs from "ejs";
import ora from "ora";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { logCreate } from "../functions/index.js";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generate(type, name) {
    const spinner = ora(`Generating ...`);

    try {
        const templatePath = path.join(__dirname, `../templates/${type}.ejs`);
        if (type === "resource" || type === "res") {
            type = "resource";

            if (!name) {
                const answer = await inquirer.prompt([
                    {
                        type: "input",
                        name: "name",
                        message: `Enter the name of the ${type}:`,
                        validate: (input) =>
                            input ? true : "Name is required!",
                    },
                ]);
                name = answer.name;
            }

            spinner.start();

            const projectDir = process.cwd();
            const srcDir = path.join(projectDir, "src");
            const useSrc = fs.existsSync(srcDir);

            const folders = {
                controller: "controller",
                service: "service",
                route: "routes",
            };
            const capitalizedName =
                name.charAt(0).toUpperCase() + name.slice(1);

            for (const [typeKey, folderName] of Object.entries(folders)) {
                const baseDir = useSrc
                    ? path.join(srcDir, folderName)
                    : path.join(projectDir, folderName);
                if (!fs.existsSync(baseDir)) {
                    fs.mkdirSync(baseDir, { recursive: true });
                }

                const templatePath = path.join(
                    __dirname,
                    `../templates/${typeKey}.ejs`
                );
                const fileName = `${name}.${typeKey}.js`;
                const filePath = path.join(baseDir, fileName);

                if (fs.existsSync(filePath)) {
                    spinner.warn(
                        chalk.yellow(
                            `File ${path.relative(projectDir, filePath)} already exists.`
                        )
                    );
                    continue;
                }

                const content = await ejs.renderFile(templatePath, {
                    name,
                    capitalizedName,
                });

                fs.writeFileSync(filePath, content);
                const size = Buffer.byteLength(content, "utf8");
                console.log();
                logCreate(path.relative(projectDir, filePath), size);
            }

            spinner.succeed(
                chalk.green(`Resource "${name}" created successfully.`)
            );
            return;
        } else {
            switch (type) {
                case "controller":
                case "co":
                    type = "controller";
                    break;
                case "service":
                case "s":
                    type = "service";
                    break;
                case "model":
                case "mo":
                    type = "model";
                    break;
                case "route":
                case "r":
                    type = "route";
                    break;
                case "middleware":
                case "mi":
                    type = "middleware";
                    break;
                default:
                    spinner.fail(
                        chalk.red(
                            'Invalid schematic type. Follow to schematic types and aliases".'
                        )
                    );
                    return;
            }

            if (!name) {
                const answer = await inquirer.prompt([
                    {
                        type: "input",
                        name: "name",
                        message: `Enter the name of the ${type}:`,
                        validate: (input) =>
                            input ? true : "Name is required!",
                    },
                ]);
                name = answer.name;
            }
            spinner.start();
            const outputFileName = `${name}.${type}.js`;
            const projectDir = process.cwd();
            const srcDir = path.join(projectDir, "src");
            const controllerDirInSrc = path.join(srcDir, type);
            const controllerDir = path.join(projectDir, type);
            let outputPath;

            if (fs.existsSync(srcDir)) {
                if (fs.existsSync(controllerDirInSrc)) {
                    outputPath = path.join(controllerDirInSrc, outputFileName);
                } else {
                    fs.mkdirSync(controllerDirInSrc, { recursive: true });
                    outputPath = path.join(controllerDirInSrc, outputFileName);
                }
            } else {
                if (fs.existsSync(controllerDir)) {
                    outputPath = path.join(controllerDir, outputFileName);
                } else {
                    fs.mkdirSync(controllerDir, { recursive: true });
                    outputPath = path.join(controllerDir, outputFileName);
                }
            }

            if (fs.existsSync(outputPath)) {
                spinner.fail(
                    chalk.red(`File ${outputFileName} already exists.`)
                );
                return;
            }

            const capitalizedName =
                name.charAt(0).toUpperCase() + name.slice(1);
            const content = await ejs.renderFile(templatePath, {
                name,
                capitalizedName,
            });
            const size = Buffer.byteLength(content, "utf8");
            console.log();
            logCreate(path.relative(process.cwd(), outputPath), size);
            fs.writeFileSync(outputPath, content);
            spinner.succeed(
                chalk.green(`${type} "${name}" created successfully.`)
            );
        }
    } catch (err) {
        spinner.fail(
            chalk.red(
                `Use "controller (co)", "service (s)", "model (mo)", "route (r)", or "middleware (mi)`
            )
        );
    }
}
