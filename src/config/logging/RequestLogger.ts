import { Request, Response, NextFunction } from 'express';
import { Logger } from './Logging';

const logger = new Logger('http-service');

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  const userAgent = req.get('user-agent') || 'unknown';
  const user = (req as any).user?.id || 'unauthenticated';


  const requestBody = method !== 'GET' ? sanitizeRequestBody(req.body) : undefined;


  logger.debug(`Incoming request: ${method} ${originalUrl}`, {
    ip,
    userAgent,
    requestBody
  });


  const originalSend = res.send;
  res.send = function(body?: any): Response {
    res.send = originalSend;
    return originalSend.call(this, body);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;


    const logData = {
      method,
      url: originalUrl,
      statusCode,
      durationMs: duration,
      user,
      ip
    };

    if (statusCode >= 500) {
      logger.error(`Request failed: ${method} ${originalUrl} - ${statusCode} (${duration}ms)`, logData);
    } else if (statusCode >= 400) {
      logger.warn(`Request error: ${method} ${originalUrl} - ${statusCode} (${duration}ms)`, logData);
    } else {
      logger.info(`Request completed: ${method} ${originalUrl} - ${statusCode} (${duration}ms)`, logData);
    }
  });

  next();
};


function sanitizeRequestBody(body: any): any {
  if (!body) return undefined;

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'authorization'];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) sanitized[field] = '[REDACTED]';
  });

  return sanitized;
}
