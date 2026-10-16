import { logger } from '../logger';
import { pool } from './pool';

export const isDatabaseAlive = async (targetPool = pool) => {
    return await targetPool
        .query('SELECT 1')
        .then(() => {
            return true;
        })
        .catch((err: unknown) => {
            logger.warn({ err }, 'Database health check failed');
            return false;
        });
};
