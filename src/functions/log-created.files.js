import chalk from "chalk";

export function logCreate(filePath, size) {
    console.log(
        `${chalk.green("CREATE")} ${filePath} ${chalk.gray(`(${size} bytes)`)}`
    );
}
