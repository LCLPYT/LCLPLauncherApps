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
    const merged = mergeObjects(base, content, [])
    const name = path.basename(file).split('.')[0].concat('.jsonc')
    await fs.promises.writeFile(path.resolve(out, name), JSON.stringify(merged))
}

function mergeObjects(x, y, path) {
    if (Array.isArray(x) && Array.isArray(y)) {
        if (path.length === 1 && path[0] === 'artifacts') {
            const arr = [...x];
            y.forEach(yElem => {
                if (!('id' in yElem)) return;

                const correspondant = arr.find(xElem => 'id' in xElem && xElem.id === yElem.id);
                let idx;
                if (correspondant && (idx = arr.indexOf(correspondant)) >= 0) arr[idx] = mergeObjects(correspondant, yElem, [])
                else arr.push(yElem);
            });
            return arr;
        } else return [...x, ...y]
    }
    else if (typeof x === 'object' && typeof y === 'object') {
        const merged = {...x}
        Array.from(Object.entries(y)).forEach(([key, value]) => {
            merged[key] = key in merged && isMergeable(merged[key], value) ? mergeObjects(merged[key], value, [...path, key]) : value
        });
        return merged
    } 
    else throw new Error(`Given parameters must be of the same type (either object or array)! Found: ${typeof x}, ${typeof y}`)
}

function isMergeable(x, y) {
    return (Array.isArray(x) && Array.isArray(y)) || (typeof x === 'object' && typeof y === 'object');
}