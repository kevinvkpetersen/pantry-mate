import type { PantryItem } from '@pantry-mate/types';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { app } from '../app';
import { listItems } from '../repositories/items';

vi.mock('../repositories/items', () => ({
    listItems: vi.fn(),
}));

afterEach(() => {
    vi.clearAllMocks();
});

describe('Items', () => {
    it('returns the items from the repository', async () => {
        const items: PantryItem[] = [
            {
                id: 1,
                name: 'Rice',
                quantity: 1.5,
                unit: 'kg',
                expiresOn: '2027-04-01',
            },
            { id: 2, name: 'Eggs', quantity: 6, unit: null, expiresOn: null },
        ];

        vi.mocked(listItems).mockResolvedValue(items);

        const response = await request(app).get('/items');

        expect(response.status).toBe(200);
        expect(response.body as PantryItem[]).toEqual(items);
    });

    it('responds with 500 when the repository fails', async () => {
        vi.mocked(listItems).mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/items');

        expect(response.status).toBe(500);
    });
});
