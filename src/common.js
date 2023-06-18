import chalk from "chalk";
import path from "path";
import { argv } from "process";
import { exists, mkdirp } from "./fshelper.js";

export function error(...msg) {
    console.error(chalk.red(msg.join(' ')));
    process.exit(1);
}

export function tooFewArguments(...explainArgs) {
    const [exe, index] = argv;
    error(`Too few arguments.\nUsage: ${exe} ${index} ${explainArgs.join(' ')}`);
}

export function getTmpDir() {
    return path.resolve('.tmp');
}

export async function ensureTmpDirExists() {
    const tmpDir = getTmpDir();
    if (!await exists(tmpDir))
        await mkdirp(tmpDir);

    return tmpDir;
}