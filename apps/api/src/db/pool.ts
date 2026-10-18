import { Pool } from 'pg';

import { config } from '../config';
import { logger } from '../logger';

export const pool = new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
});

/* v8 ignore start -- @preserve */ // only runs when idle connection fails, which tests don't trigger
// An idle connection can error (e.g. the database restarts). Without a handler, Node treats it as an unhandled error and crashes.
pool.on('error', (err) => {
    logger.error({ err }, 'Unexpected error on idle database client');
});
/* v8 ignore end -- @preserve */

export const closePool = () => pool.end();
