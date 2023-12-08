import { Router } from 'express';
import { compressionSchema } from '../utils/zod';
import { validate } from '../middlewares/validation';
import { compress } from '../controllers/compression_controller';

const router = Router();

/**
 * /compression/compress : Compress a video or image file
 */
router.post(
    '/compress',
    validate(compressionSchema, 'body'),
    async (req, res) => {
        compress(req, res);
    }
);

export default router;