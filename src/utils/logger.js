import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.printf(
  ({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`,
);

const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    // Show logs in console (for development)
    new winston.transports.Console(),

    // Save all logs to daily rotating files
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m', // each log file max 10 MB
      maxFiles: '14d', // keep logs for 14 days
      zippedArchive: true,
    }),

    // Save only error logs separately
    new DailyRotateFile({
      level: 'error',
      filename: 'logs/errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      zippedArchive: true,
    }),
  ],
});

logger.exceptions.handle(new winston.transports.File({ filename: 'logs/exceptions.log' }));

logger.rejections.handle(new winston.transports.File({ filename: 'logs/rejections.log' }));

export default logger;
