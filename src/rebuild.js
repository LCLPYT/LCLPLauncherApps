import { jsoncSafe } from "jsonc/lib/jsonc.safe.js";
import { error } from "./common.js";
import { createArtifact } from "./tools/artifact.js";
import path from 'path';
import fs from 'fs';

export async function rebuild(dir) {
    // parse base file
    const baseFile = path.resolve(dir, 'src', 'base.installation.jsonc')
    const [err, base] = jsoncSafe.parse(await fs.promises.readFile(baseFile, 'utf8'))
    if (err)
        error(`Error parsing '${baseFile}: ${err}'`)

    await updateArtifacts(base);

    await jsoncSafe.write(baseFile, base, { space: 4 });
}

async function updateArtifacts(base) {
    /** @type {object[]} */
    const artifacts = base.artifacts;
    if (!artifacts) return;

    await Promise.all(artifacts
        .filter(x => typeof x === 'object' && !Array.isArray(x))
        .map(x => updateArtifact(x)));
}

async function updateArtifact(obj) {
    const url = obj.url;
    if (!url) return;

    let artifact;
    try {
        artifact = await createArtifact(url);
    } catch(any) {
        error('Failed to fetch artifact', url, any);
        return;
    }

    obj.md5 = artifact.md5;
    obj.size = artifact.size;
}