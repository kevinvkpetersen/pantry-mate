import type { Location, NewLocation, NewPantryItem } from '@pantry-mate/types';
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

export const clearDatabase = () =>
    testPool.query(`
        TRUNCATE
            items,
            locations
        RESTART IDENTITY
    `);

export const insertItem = ({
    name,
    locationId,
    quantity,
    unit,
    expiresOn,
}: NewPantryItem) =>
    testPool.query(
        `
        INSERT INTO items (
            name,
            location_id,
            quantity,
            unit,
            expires_on
        ) VALUES ($1, $2, $3, $4, $5)
    `,
        [name, locationId, quantity, unit, expiresOn]
    );

export const insertLocation = async ({
    name,
}: NewLocation): Promise<Location> => {
    const result = await testPool.query<Location>(
        `
        INSERT INTO locations (
            name
        ) VALUES ($1)
        RETURNING *
    `,
        [name]
    );
    const location = result.rows[0];
    if (!location) throw new Error('Insert returned no row');
    return location;
};
