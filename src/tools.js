import { argv } from "process";
import { error, tooFewArguments } from "./common.js";
import artifact from "./tools/artifact.js";

const args = argv.slice(2);

if (args.length < 1) 
    tooFewArguments('<tool>');

const tool = args.shift();
switch (tool) {
    case 'artifact':
        await artifact(args);
        break;

    default:
        error(`Unknown tool '${tool}'`);
        break;
}