/**
 * Winston logger configuration
 */
import { createLogger, format, transports } from 'winston';

const customFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] : ${message}`;
});

const logLevel = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp(),
    customFormat
    ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
  ],
});

export default logger;