import fs from 'fs';
import path from 'path';
import { ensureTmpDirExists, error, tooFewArguments } from '../common.js';
import Downloader from 'nodejs-file-downloader';
import { checksumFile } from '../checksums.js';

const DOWNLOAD_DELAY_MS = 3000;

export default async function artifact(args) {
    if (args.length < 1)
        tooFewArguments('tool:artifact', '<url>')

    /** @type string */
    const url = args[0];

    const artifact = await createArtifact(url);

    console.log(JSON.stringify(artifact, null, 4));
}

export async function createArtifact(url) {
    const tmpDir = await ensureTmpDirExists();

    let downloadedName = null;
    await new Downloader({
        url: url,
        directory: tmpDir,
        maxAttempts: 3,
        shouldStop() {
          if (e.statusCode && e.statusCode === 404) {
            return true;
          }
        },
        cloneFiles: false,
        onBeforeSave: deducedName => {
            return downloadedName = deducedName;
        },
    }).download();

    await new Promise((resolve) => {
        setTimeout(resolve, DOWNLOAD_DELAY_MS);
    });

    if (!downloadedName)
        error('Could not deduce download file name');

    const file = path.resolve(tmpDir, downloadedName);

    const stat = await fs.promises.stat(file);
    const md5 = await checksumFile(file, 'md5');

    const artifact = {
        url: url,
        size: stat.size,
        md5: md5
    };

    await fs.promises.unlink(file);

    return artifact;
}