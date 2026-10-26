import type { Location } from '@pantry-mate/types';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { listLocations } from '../repositories/locations';
import { app } from '../server/app';

vi.mock('../repositories/locations', () => ({
    listLocations: vi.fn(),
}));

describe('Locations', () => {
    it('returns a list of locations', async () => {
        const locations: Location[] = [
            { id: 1, name: 'Pantry' },
            { id: 2, name: 'Fridge' },
        ];

        vi.mocked(listLocations).mockResolvedValue(locations);

        const response = await request(app).get('/locations');

        expect(response.status).toBe(200);
        expect(response.body as Location[]).toEqual(locations);
    });

    it('responds with 500 when the repository fails', async () => {
        vi.mocked(listLocations).mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/locations');

        expect(response.status).toBe(500);
    });
});
