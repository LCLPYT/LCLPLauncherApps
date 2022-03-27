import chalk from 'chalk';
import path from 'path';
import { argv } from 'process';
import { compile } from './compiler.js';
import { exists } from './fshelper.js';

function error(msg) {
    console.error(chalk.red(msg));
    process.exit(1);
}

const [exe, index, ...args] = argv;

if (args.length < 1) 
    error(`To few arguments.\nUsage: ${exe} ${index} <appId>`);

const appId = args[0];
const dir = path.resolve('apps', appId);

if (!await exists(dir)) 
    error(`Directory not found: ${dir}`)

console.log(`Compiling app '${appId}' in '${dir}' ...`);
await compile(dir);
console.log(chalk.greenBright.bold('Done.'))
