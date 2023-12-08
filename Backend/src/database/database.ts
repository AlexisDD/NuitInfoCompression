import mongoose, { ConnectOptions } from "mongoose";
import logger from "../utils/logger";

export * from "./schemas/user";

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nuitinfo";

const mongooseOptions = {
    connectTimeoutMS: 5000, 
} as ConnectOptions;

export async function connectToDatabase() : Promise<boolean> {
    try {
        logger.info(`Connecting to MongoDB at: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        logger.info("Connected to MongoDB");
        return true;
    } catch (error) {
        logger.error("Error connecting to MongoDB: ", error);
        return false;
    }
}

export async function closeConnection() : Promise<void> {
    await mongoose.disconnect();
}