import * as path from 'path'
import * as fs from 'fs'

const src = 'src', out = 'out';

const baseFileName = 'base.installation.jsonc';
const baseFile = path.resolve(src, baseFileName)
const base = JSON.parse(await fs.promises.readFile(baseFile, 'utf8'))

const files = await fs.promises.readdir(src)
const tasks = files.filter(file => file.endsWith('.installation.jsonc') && file !== baseFileName)
    .map(file => compileFile(path.resolve(src, file)))
await Promise.all(tasks)

async function compileFile(file) {
    const content = JSON.parse(await fs.promises.readFile(file, 'utf8'))
    const merged = mergeObjects(base, content)
    const name = path.basename(file).split('.')[0].concat('.jsonc')
    await fs.promises.writeFile(path.resolve(out, name), JSON.stringify(merged))
}

function mergeObjects(x, y) {
    if (Array.isArray(x) && Array.isArray(y)) {
        return [...x, ...y]
    }
    else if (typeof x === 'object' && typeof y === 'object') {
        const merged = {...x}
        Array.from(Object.entries(y)).forEach(([key, value]) => {
            merged[key] = key in merged ? mergeObjects(merged[key], value) : value;
        });
        return merged
    } 
    else throw new Error('Given parameters must be of the same type (either object or array)!')
}