import { pool } from '../db/pool';

type PantryItem = {
    id: number;
    name: string;
    quantity: number;
    unit: string | null;
    expiresOn: string | null;
};

export const listItems = async (): Promise<PantryItem[]> => {
    const { rows } = await pool.query<PantryItem>(`
        SELECT 
            id,
            name,
            quantity::float8 AS quantity,
            unit,
            to_char(expires_on, 'YYYY-MM-DD') AS "expiresOn"
        FROM items
    `);

    return rows;
};
