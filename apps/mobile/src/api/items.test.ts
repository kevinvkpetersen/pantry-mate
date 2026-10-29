import { ITEMS_TEST_DATA } from '@/__tests__/fixtures';

import { fetchItems } from './items';

describe('fetchItems', () => {
    it('fetches the items from the API', async () => {
        const items = Object.values(ITEMS_TEST_DATA);
        const fetchMock = jest
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue(Response.json(items));

        await expect(fetchItems()).resolves.toEqual(items);

        expect(fetchMock).toHaveBeenCalledWith('http://api.invalid/items');
    });

    it('throws with the status code when the response is not ok', async () => {
        jest.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(null, { status: 500 })
        );

        await expect(fetchItems()).rejects.toThrow('HTTP 500');
    });
});
