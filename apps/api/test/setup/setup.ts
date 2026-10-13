import { afterAll, inject, vi } from 'vitest';

import { closeTestPool } from '../utils/db';

const db = inject('db');

// config.ts reads the environment when it is imported, so point it at the
// container first, then import the real repository and pool.
vi.stubEnv('POSTGRES_USER', db.user);
vi.stubEnv('POSTGRES_PASSWORD', db.password);
vi.stubEnv('POSTGRES_HOST', db.host);
vi.stubEnv('POSTGRES_PORT', String(db.port));
vi.stubEnv('POSTGRES_DB', db.database);

afterAll(async () => {
    // Imported here, not at the top of the file, so config.ts loads after the stubbed env is set.
    const { closePool } = await import('../../src/db/pool.js');
    await closePool();

    await closeTestPool();
});
