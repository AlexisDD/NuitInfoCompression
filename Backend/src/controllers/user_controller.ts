import bcrypt from 'bcryptjs';
import { User } from '../database/database';
import { LoggedRequest, TypedPayload } from '../utils/types';
import { userLoginSchema, userRegisterSchema } from '../utils/zod';
import { Request, Response } from 'express';
import { generateAccessToken } from '../utils/jwt';

/**
 * Checks if the given password matches the password hash.
 * @param {String} password Password to check
 * @param {String} passwordHash Password hash to check against
 * @returns {Boolean} True if the password matches the password hash, false otherwise
 */
async function checkPassword(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
}

/**
 * Registers a new user.
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
export async function register(req: Request, res: Response) {
    const { password, confirmPassword, email } = req.body as TypedPayload<typeof userRegisterSchema>;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        password: passwordHash,
        email: email.toLowerCase(),
    });
    const savedUser = await newUser.save();

    // Generate a JWT token for the user and send it back
    const token = generateAccessToken(savedUser);
    res.status(201).json({ 
        token,
        email: savedUser.email,
    });
}

/**
 * Logs in a user.
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
export async function login(req: Request, res: Response) {
    const { email, password } = req.body as TypedPayload<typeof userLoginSchema>;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await checkPassword(password, user.password);
    if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for the user and send it back
    const token = generateAccessToken(user);
    res.status(200).json(
        { 
            token,
            email: user.email,
        }
    );
}

/**
 * Gets information about the logged user.
 * @param {LoggedRequest} req Request object. Must contain a user field of type {@link CustomJwtPayload} to authenticate the user.
 * @param {Response} res Response object
 */
export async function getUser(req: LoggedRequest, res: Response) {
    const loggedUser = req.user;

    const user = await User.findOne({ _id: loggedUser.id }, { password: 0, __v: 0, _id: 0  });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
}