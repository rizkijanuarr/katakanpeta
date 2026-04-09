import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';


const devConsoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);


const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

export class Logger {
  private logger: winston.Logger;

  constructor(serviceName: string = 'app-service') {
    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      format: isProduction ? prodFormat : devConsoleFormat,
      defaultMeta: { service: serviceName },
      transports: this.setupTransports(),
    });
  }

  private setupTransports(): winston.transport[] {
    const transports: winston.transport[] = [];

    if (!isProduction) {
      transports.push(new winston.transports.Console());
    }

    transports.push(
      new DailyRotateFile({
        dirname: 'logs',
        filename: 'app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '14d',
        level: 'info',
      }),
      new DailyRotateFile({
        dirname: 'logs',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '30d',
        level: 'error',
      })
    );

    return transports;
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}
