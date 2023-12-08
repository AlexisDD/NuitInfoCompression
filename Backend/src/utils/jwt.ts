import jwt from 'jsonwebtoken';
import { IUser } from '../database/database';

// payload type for the JWT token
export interface CustomJwtPayload {
    id: string;
    email: string;
}

/**
 * Generates a JWT token for the given user, this token will be used to authenticate the user.
 * @param {IUser} user User to generate the token for
 * @returns {String} JWT token
 */
export function generateAccessToken(user: IUser): string {
    const payload = {
        id: user._id,
        email: user.email,
    } as CustomJwtPayload;

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '7d' });
}

/**
 * Verifies that the given token is valid (not expired, not tampered with, etc.).
 * @param token JWT token to verify
 * @returns {String | Object} Decoded token payload
 */
export function verifyAccessToken(token: string): string | object {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
}