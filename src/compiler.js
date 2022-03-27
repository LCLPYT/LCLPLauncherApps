import path from 'path'
import fs from 'fs'
import { mergeObjects } from './utils.js';
import { exists, mkdirp } from './fshelper.js';
import { jsoncSafe } from "jsonc/lib/jsonc.safe.js";

export async function compile(dir) {
    const src = 'src', out = 'out';
    const srcDir = path.resolve(dir, src), outDir = path.resolve(dir, out);

    // parse base file
    const baseFileName = 'base.installation.jsonc';
    const baseFile = path.resolve(dir, src, baseFileName)
    const base = jsoncSafe.parse(await fs.promises.readFile(baseFile, 'utf8'))

    // create out directory, if it does not exist yet
    if (!await exists(outDir)) 
        await mkdirp(outDir);
    
    // compile all variants
    const files = await fs.promises.readdir(srcDir);
    const tasks = files.filter(file => file.endsWith('.installation.jsonc') && file !== baseFileName)
        .map(file => compileFile(path.resolve(dir, src, file), base, outDir))

    await Promise.all(tasks)
}

export async function compileFile(file, base, out) {
    const content = jsoncSafe.parse(await fs.promises.readFile(file, 'utf8'))
    const merged = mergeObjects(base, content, [])
    const name = path.basename(file).split('.')[0].concat('.jsonc')

    // output can be plain JSON
    await fs.promises.writeFile(path.resolve(out, name), JSON.stringify(merged))
}