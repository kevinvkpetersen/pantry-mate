import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { isDatabaseAlive } from '../db/health';
import { app } from '../server/app';
import { isShuttingDown } from '../server/shutdown';

vi.mock('../db/health', () => ({
    isDatabaseAlive: vi.fn(() => Promise.resolve(true)),
}));
vi.mock('../server/shutdown', () => ({
    isShuttingDown: vi.fn(() => false),
}));

describe('healthcheck', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns status ok when it can validate connection to the db', async () => {
        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });

    it('returns an error when it cannot validate connection to the db', async () => {
        vi.mocked(isDatabaseAlive).mockResolvedValue(false);

        const response = await request(app).get('/health');

        expect(response.status).toBe(503);
        expect(response.body).toEqual({ status: 'unavailable' });
    });

    it('returns status shutting_down when the server is shutting down', async () => {
        vi.mocked(isShuttingDown).mockReturnValue(true);

        const response = await request(app).get('/health');

        expect(response.status).toBe(503);
        expect(response.body).toEqual({ status: 'shutting_down' });
        expect(isDatabaseAlive).not.toHaveBeenCalled();
    });
});
