import axios from 'axios';
import fs from 'fs';
import * as mime from 'mime-types';
import path from 'path';
import logger from './logger';
import ffmpeg from 'fluent-ffmpeg';

const downloadPath = './downloads';

function generateRandomFileName(): string {
    const randomFileName = Math.random().toString(36).substring(7);
    return randomFileName;
}

async function getMultimediaDimensions(filePath: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
                return;
            }
            const { width, height } = metadata.streams[0] as { width: number, height: number };
            resolve({ width, height });
        });
    });
}

async function downloadFile(url: string): Promise<string> {
    logger.debug(`Downloading file from ${url}`);
    const response = await axios.get(url, { responseType: 'stream' });
    
    const mimeType = response.headers['content-type'];
    const extension = mime.extension(mimeType);

    const outputFileName = generateRandomFileName();
    const filePath = path.join(downloadPath, `${outputFileName}.${extension}`);
    const writer = fs.createWriteStream(`${filePath}`);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            const path = `${downloadPath}/${outputFileName}.${extension}`;

            logger.debug(`File downloaded to ${path}`);
            resolve(`${path}`);
        });
        writer.on('error', reject);
    });
}

export { downloadFile, getMultimediaDimensions };