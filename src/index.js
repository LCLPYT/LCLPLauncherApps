import chalk from 'chalk';
import path from 'path';
import { argv } from 'process';
import { error, tooFewArguments } from './common.js';
import { compile } from './compiler.js';
import { exists } from './fshelper.js';

const args = argv.slice(2);

if (args.length < 1) 
    tooFewArguments('<appId>');

const appId = args[0];
const dir = path.resolve('apps', appId);

if (!await exists(dir)) 
    error(`Directory not found: ${dir}`)

console.log(`Compiling app '${appId}' in '${dir}' ...`);
await compile(dir);
console.log(chalk.greenBright.bold('Done.'))
