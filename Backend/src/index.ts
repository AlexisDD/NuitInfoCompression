import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import app from './app';
import { connectToDatabase } from './database/database';
import logger from './utils/logger';

const port = process.env.PORT || 8080;

logger.info("Starting server...");

// Start the app only if we can connect to the database
/*connectToDatabase().then((result: boolean) => {
    if (!result) {
        logger.error("Could not connect to database. Exiting...");
        process.exit(1);
    }
    else {
        
    }
});*/

// Start the web server
app.listen(port, () => {
    logger.info(`Server started at http://localhost:${port}`);
});