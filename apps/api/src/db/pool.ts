import { Pool } from 'pg';

import { config } from '../config';
import { logger } from '../logger';

export const pool = new Pool({
    connectionString: config.DATABASE_URL,
});

/* v8 ignore start -- @preserve */ // only runs when idle connection fails, which tests don't trigger
// An idle connection can error (e.g. the database restarts). Without a handler, Node treats it as an unhandled error and crashes.
pool.on('error', (err) => {
    logger.error({ err }, 'Unexpected error on idle database client');
});
/* v8 ignore end -- @preserve */

export const closePool = () => pool.end();
