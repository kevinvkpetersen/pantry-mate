import { Pool } from 'pg';
import { describe, expect, it } from 'vitest';

import { isDatabaseAlive } from '../src/db/health';
import { getUnusedPort } from './utils/pool';

describe('database health', () => {
    it('should return true if the database is reachable', async () => {
        expect(await isDatabaseAlive()).toBe(true);
    });

    it('should return false if the database is not reachable', async () => {
        const brokenPool = new Pool({
            host: '127.0.0.1',
            port: await getUnusedPort(),
            user: 'nobody',
            password: 'nothing',
            database: 'none',
            connectionTimeoutMillis: 2000,
        });

        try {
            expect(await isDatabaseAlive(brokenPool)).toBe(false);
        } finally {
            await brokenPool.end();
        }
    });
});
