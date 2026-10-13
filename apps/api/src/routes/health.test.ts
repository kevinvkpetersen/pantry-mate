import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { app } from '../app';
import { isDatabaseAlive } from '../db/health';

vi.mock('../db/health', () => ({
    isDatabaseAlive: vi.fn(),
}));

describe('healthcheck', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns status ok when it can validate connection to the db', async () => {
        vi.mocked(isDatabaseAlive).mockResolvedValue(true);

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
});
