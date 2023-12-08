import { z } from "zod";

/**
 * Zod schemas for request validation (check that all required fields are present and of the correct type).
 */

// User registration schema
export const userRegisterSchema = z.object({
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
    email: z.string().email(),
});

// User login schema
export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// Compression schema
export const compressionSchema = z.object({
    url: z.string().url(),
    size: z.string().optional(),
});