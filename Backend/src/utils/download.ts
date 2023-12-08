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

/**
 * Get the dimensions of a multimedia file
 * @param filePath The path to the multimedia file
 * @returns The dimensions of the multimedia file
 */
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

/**
 * Download a file from a given URL and save it to the downloads folder
 * @param url The URL to download the file from
 * @returns The path to the downloaded file
 */
async function downloadFile(url: string): Promise<string> {
    logger.debug(`Downloading file from ${url}`);
    const response = await axios.get(url, { responseType: 'stream' });
    
    const mimeType = response.headers['content-type'];
    const extension = mime.extension(mimeType);

    // Generate a random file name
    const outputFileName = generateRandomFileName();
    const filePath = path.join(downloadPath, `${outputFileName}.${extension}`);

    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
    }

    // Write the file to the downloads folder
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