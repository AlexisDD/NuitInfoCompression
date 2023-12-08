import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import logger from './logger';
import fs from 'fs';

const outputPath = './public/images';

function stringToBytes(input: string): number {
    const regex = /^(\d+)([KMG]?B)$/i;
    const match = input.match(regex);

    if (!match) {
        throw new Error('Invalid input format');
    }

    const size = parseInt(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
        case '':
        case 'B':
            return size;
        case 'KB':
            return size * 1024;
        case 'MB':
            return size * 1024 * 1024;
        case 'GB':
            return size * 1024 * 1024 * 1024;
        default:
            throw new Error('Invalid size unit');
    }
} 

/**
 * Compress an image to AVIF format using sharp
 * @param filePath The path to the image file
 * @returns The path to the compressed image file
 */
function compressImage(filePath: string, maximumSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = filePath.split('/').pop();
    const outputFilePath = `${outputPath}/${fileName}_compressed.avif`;

    const fileSize = fs.statSync(filePath).size;
    const compressionRatio = maximumSize / fileSize;

    let quality = 50; // 0 (worst) - 100 (best)
    let effort = 4; // 0 (fastest) - 9 (best)
    if (maximumSize !== 0) {
        if (compressionRatio < 0.1) {
            quality = 10;
            effort = 0;
        } else if (compressionRatio < 0.25) {
            quality = 25;
            effort = 2;
        } else if (compressionRatio < 0.5) {
            quality = 40;
            effort = 3;
        }
    }

    // Compress image to AVIF format without reducing size
    sharp(filePath)
        .avif({ quality: quality, effort: effort })
        .toFile(outputFilePath)
        .then(() => {
            logger.debug('Image compression completed');
            resolve(`${fileName}_compressed.avif`);
        })
        .catch((err) => {
            logger.error('Error compressing image:', err);
            reject(err);
        });
  });
}

/**
 * Compress a video to AV1 format using ffmpeg
 * @param filePath The path to the video file
 * @param maximumSize The maximum size of the compressed video file
 * @returns The path to the compressed video file
 */
function compressVideo(filePath: string, maximumSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = filePath.split('/').pop();
    const outputFilePath = `${outputPath}/${fileName}_compressed.mp4`;

    const fileSize = fs.statSync(filePath).size;
    // We calculate a compression ratio with the maximum desired size to determine the quality of the video
    const compressionRatio = maximumSize / fileSize;
    logger.debug(`File size: ${fileSize}`);

    let crf = 40; // Constant Rate Factor (0-63); 0 = lossless (default = 30)
    let preset = 6; // 0 (slowest and best quality) - 8 (fastest and worst quality)

    if (maximumSize !== 0) {
        logger.debug(`Maximum size: ${maximumSize}`);
        logger.debug(`Compression ratio: ${compressionRatio}`);
        if (compressionRatio < 0.1) {
            crf = 60;
            preset = 8;
        } else if (compressionRatio < 0.25) {
            crf = 50;
            preset = 7;
        } else if (compressionRatio < 0.5) {
            crf = 40;
            preset = 7;
        }
    } 

    // Compress video to AV1 format without reducing size
    ffmpeg(filePath)
        .outputOptions('-c:v', 'libsvtav1')
        .outputOptions('-crf', crf.toString()) 
        .outputOptions('-preset', preset.toString()) 
        .outputOptions('-strict', 'experimental')
        .output(outputFilePath)
        .on('end', () => {
            logger.debug('Video compression completed');
            resolve(`${fileName}_compressed.mp4`);
        })
        .on('error', (err) => {
            logger.error('Error compressing video:', err);
            reject(err);
        })
        .run();
   });
}

export { stringToBytes, compressImage, compressVideo };