import { TypedPayload } from "../utils/types";
import { compressionSchema } from "../utils/zod";
import { Request, Response } from 'express';
import { compressImage, compressVideo, stringToBytes } from "../utils/compression";
import { downloadFile, getMultimediaDimensions } from "../utils/download";
import fs from 'fs';

/**
 * Compress a video or image file
 * @param req The express request object
 * @param res The express response object
 */
export async function compress(req: Request, res: Response) {
    const { url, size } = req.body as TypedPayload<typeof compressionSchema>;

    // Download the file from the given URL
    const filePath = await downloadFile(url);
    const fileStats = fs.statSync(filePath);
    const dimensions = await getMultimediaDimensions(filePath);
    
    let sizeInBytes = 0;
    if (size) {
        sizeInBytes = stringToBytes(size);
    }

    // Check if the file is an image or video
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(filePath);
    const isVideo = /\.(mp4|mov|avi|wmv|mkv)$/i.test(filePath);

    if (!isImage && !isVideo) {
        res.status(400).json({ message: 'Invalid file format' });
        return;
    }

    let compressedFilePath = '';
    if (isImage) {
        compressedFilePath = await compressImage(filePath, sizeInBytes);
    } else if (isVideo) {
        compressedFilePath = await compressVideo(filePath, sizeInBytes);
    }

    const compressedFileStats = fs.statSync(`public/images/${compressedFilePath}`);
    const compressedDimensions = await getMultimediaDimensions(`public/images/${compressedFilePath}`);

    const fullUrl = `${req.protocol}://${req.get('host')}/images/${compressedFilePath}`;

    res.status(200).json({ 
        compressed : fullUrl,
        originalSize: fileStats.size,
        originalDimensions: {
            width: dimensions.width,
            height: dimensions.height,
        },
        originalFormat: filePath.split('.').pop(),
        compressedSize: compressedFileStats.size,
        compressedDimensions: {
            width: compressedDimensions.width,
            height: compressedDimensions.height,
        },
        compressedFormat: isImage ? 'avif' : 'mp4 (AV1 codec)',
    });
}
