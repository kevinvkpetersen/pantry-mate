import { pool } from './pool';

export const isDatabaseAlive = async (targetPool = pool) => {
    return await targetPool
        .query('SELECT 1')
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
};
