import { Request, Response, NextFunction } from 'express';
import { LoggedRequest } from '../utils/types';
import { CustomJwtPayload, verifyAccessToken } from '../utils/jwt';

/**
 * Checks if the user is authenticated before accessing a protected route.
 */
export const authenticated = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the JWT is valid and not expired.
    try {
        const payload = verifyAccessToken(token);
        (req as LoggedRequest).user = payload as CustomJwtPayload;
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    return next();
};

