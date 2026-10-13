import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';
import type { TestProject } from 'vitest/node';

const SCHEMA_FILE = path.resolve(
    __dirname,
    '../../../../docker/db/init/001-schema.sql'
);

const setup = async (project: TestProject) => {
    const container = await new PostgreSqlContainer('postgres:18').start();

    const pool = new Pool({ connectionString: container.getConnectionUri() });
    await pool.query(await readFile(SCHEMA_FILE, 'utf8'));
    await pool.end();

    project.provide('db', {
        user: container.getUsername(),
        password: container.getPassword(),
        host: container.getHost(),
        port: container.getPort(),
        database: container.getDatabase(),
    });

    return async () => {
        await container.stop();
    };
};

declare module 'vitest' {
    export interface ProvidedContext {
        db: {
            user: string;
            password: string;
            host: string;
            port: number;
            database: string;
        };
    }
}

export default setup;
