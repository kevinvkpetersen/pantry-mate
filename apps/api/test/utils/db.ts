import type { NewPantryItem } from '@pantry-mate/types';
import { Pool } from 'pg';
import { inject } from 'vitest';

const db = inject('db');

const testPool = new Pool({
    user: db.user,
    password: db.password,
    host: db.host,
    port: db.port,
    database: db.database,
});

export const closeTestPool = () => testPool.end();

export const clearItems = () =>
    testPool.query('TRUNCATE items RESTART IDENTITY');

export const insertItem = ({
    name,
    quantity,
    unit,
    expiresOn,
}: NewPantryItem) =>
    testPool.query(
        'INSERT INTO items (name, quantity, unit, expires_on) VALUES ($1, $2, $3, $4)',
        [name, quantity, unit, expiresOn]
    );
