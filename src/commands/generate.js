import fs from "fs";
import ejs from "ejs";
import ora from "ora";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generate(type, name) {
    const spinner = ora(`Generating ${type} "${name}"...`).start();
    try {
        const templatePath = path.join(__dirname, `../templates/${type}.ejs`);
        const outputFileName = `${name}.${type}.js`;
        const outputPath = path.join(process.cwd(), outputFileName);

        if (!fs.existsSync(templatePath)) {
            spinner.fail(chalk.red(`Template for '${type}' not found.`));
            return;
        }

        if (fs.existsSync(outputPath)) {
            spinner.fail(chalk.red(`File ${outputFileName} already exists.`));
            return;
        }

        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        const content = await ejs.renderFile(templatePath, {
            name,
            capitalizedName,
        });
        fs.writeFileSync(outputPath, content);

        spinner.succeed(chalk.green(`${type} "${name}" created successfully.`));
    } catch (err) {
        spinner.fail(chalk.red(`Error: ${err.message}`));
    }
}
