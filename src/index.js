import chalk from 'chalk';
import path from 'path';
import { argv } from 'process';
import { error, tooFewArguments } from './common.js';
import { compile } from './compiler.js';
import { exists } from './fshelper.js';
import { rebuild } from './rebuild.js';

const args = argv.slice(2);

if (args.length < 1) 
    tooFewArguments('<action>');

const action = args[0];

if (args.length < 2) 
    tooFewArguments(action, '<appId>');

const appId = args[1];
const dir = path.resolve('apps', appId);

if (!await exists(dir)) 
    error(`Directory not found: ${dir}`)

switch (action) {
    case 'compile':
        console.log(`Compiling app '${appId}' in '${dir}' ...`);
        await compile(dir);
        console.log(chalk.greenBright.bold('Done.'))
        break;

    case 'rebuild':
        console.log(`Rebuilding installer for app '${appId}' in '${dir}' ...`);
        await rebuild(dir);
        console.log(chalk.greenBright.bold('Done.'))
        break;

    default:
        error('Unknown action', action);
        break;
}
