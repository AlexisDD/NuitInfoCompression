import { Request } from "express";
import { z } from "zod";
import { CustomJwtPayload } from "./jwt";

export interface LoggedRequest extends Request {
    user: CustomJwtPayload;
}

/**
 * The TypeScript type representing a zod schema.
 */
export type TypedPayload<T extends z.ZodTypeAny> = z.infer<T>;