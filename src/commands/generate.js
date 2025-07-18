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
    const spinner = ora(`Generating ...`).start();
    try {
        if (type == "resource" || type == "res") {
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
            const templatePath = path.join(
                __dirname,
                `../templates/${type}.ejs`
            );
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
