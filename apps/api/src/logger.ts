import type { Request, Response } from 'express';
import type { LevelWithSilent } from 'pino';
import pino from 'pino';

import { config } from './config';

export const requestLogLevel = (
    req: Request,
    res: Response,
    err?: Error
): LevelWithSilent => {
    if (err) return 'error';

    const path = req.originalUrl.split('?')[0];

    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    if (path === '/health') return 'silent';

    return 'info';
};

export const logger = pino({
    level: config.LOG_LEVEL,
});
