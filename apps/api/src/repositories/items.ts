import { type Item, itemSchema } from '@pantry-mate/types';

import { pool } from '../db/pool';

export const listItems = async (): Promise<Item[]> => {
    const { rows } = await pool.query(`
        SELECT 
            id,
            name,
            location_id AS "locationId",
            quantity::float8 AS quantity,
            unit,
            to_char(expires_on, 'YYYY-MM-DD') AS "expiresOn"
        FROM items
    `);

    return itemSchema.array().parse(rows);
};
