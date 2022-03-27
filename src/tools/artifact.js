import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { ensureTmpDirExists, error, tooFewArguments } from '../common.js';
import Downloader from 'nodejs-file-downloader';
import { checksumFile } from '../checksums.js';

export default async function artifact(args) {
    if (args.length < 1)
        tooFewArguments('tool:artifact', '<url>')

    const tmpDir = await ensureTmpDirExists();

    /** @type string */
    const url = args[0];

    let downloadedName = null;
    await new Downloader({
        url: url,
        directory: tmpDir,
        cloneFiles: false,
        onBeforeSave: deducedName => {
            return downloadedName = deducedName;
        },
    }).download();

    if (!downloadedName)
        error('Could not deduce download file name');

    const file = path.resolve(tmpDir, downloadedName);

    const result = {
        url: url
    };

    const stat = await fs.promises.stat(file);
    const md5 = await checksumFile(file, 'md5');

    console.log(JSON.stringify({
        url: url,
        size: stat.size,
        md5: md5
    }, null, 4));

    await fs.promises.unlink(file);
}