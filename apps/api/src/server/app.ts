import type { Request, Response } from 'express';
import express from 'express';
import { pinoHttp } from 'pino-http';

import { logger, requestLogLevel } from '../logger';
import health from '../routes/health';
import items from '../routes/items';
import locations from '../routes/locations';

export const app = express();

app.use(
    pinoHttp<Request, Response>({ logger, customLogLevel: requestLogLevel })
);

app.use('/health', health);
app.use('/items', items);
app.use('/locations', locations);
