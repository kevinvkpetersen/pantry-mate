import { pool } from '../db/pool';

export const listItems = async () => {
    const { rows } = await pool.query('SELECT * FROM items');

    return rows;
};
