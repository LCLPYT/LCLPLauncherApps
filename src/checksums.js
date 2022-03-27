import * as crypto from 'crypto';
import * as fs from 'fs';

export function checksumFile(file, algorithm) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const input = fs.createReadStream(file);

        input.on('error', err => reject(err));
        hash.once('readable', () => resolve(hash.digest('hex')));

        input.pipe(hash);
    });
}