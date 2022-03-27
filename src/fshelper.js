import fs from 'fs'
import path from 'path'

export async function exists(file) {
    return await fs.promises.stat(file).catch(() => undefined) !== undefined;
}

export async function mkdirp(dir) {
    if (dir === '.') return;
    
    await fs.promises.stat(dir).catch(async () => { // does not exist
        const parent = path.dirname(dir);
        await mkdirp(parent);
        await fs.promises.mkdir(dir);
    });
}