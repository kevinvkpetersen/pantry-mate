import { type Location, locationSchema } from '@pantry-mate/types';

import { pool } from '../db/pool';

export const listLocations = async (): Promise<Location[]> => {
    const { rows } = await pool.query(`
        SELECT
            id,
            name
        FROM locations
    `);

    return locationSchema.array().parse(rows);
};
