import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logger from '../utils/logger';

type Location = 'body' | 'query' | 'params';

/**
 * Validates the request using a zod schema.
 */
export const validate = (schema: z.ZodTypeAny, location: Location = 'query') => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[location]);

    if (!result.success) {
        logger.debug(`Invalid request: ${result.error.message}`);
        const errors = result.error.issues.map((issue) => {
            return {
                field: issue.path.join("."),
                message: issue.message,
            };
        }
        );

        return res.status(400).json(
            {
                errors,
            },
        );
    } else {
        req[location] = result.data;
    }

    return next();
};

/**
 * Middleware that checks if the request body is valid JSON.
 * @param {Error} err Error object
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {NextFunction} next Next function
 * @returns {Response} 400 response if the JSON is invalid
 */
export const validateJson = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({
            message: "Invalid JSON",
        });
    }
    return next();
}