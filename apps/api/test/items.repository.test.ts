import { beforeEach, describe, expect, it } from 'vitest';

import { listItems } from '../src/repositories/items';
import { clearDatabase, insertItem } from './utils/db';
import { ITEMS_TEST_DATA, loadBaseline } from './utils/fixtures';

describe('Items', () => {
    let locations: Awaited<ReturnType<typeof loadBaseline>>['locations'];

    beforeEach(async () => {
        await clearDatabase();
        ({ locations } = await loadBaseline());
    });

    it('returns an empty list when there are no items', async () => {
        expect(await listItems()).toEqual([]);
    });

    it('returns a list of items if there are items', async () => {
        const testItem = {
            ...ITEMS_TEST_DATA.rice,
            locationId: locations.pantry.id,
        };
        await insertItem(testItem);

        const fetchedItems = await listItems();

        expect(fetchedItems).toEqual([
            {
                ...testItem,
                id: 1,
            },
        ]);
    });

    it('returns null for a missing unit and a missing expiry date', async () => {
        const testItem = {
            ...ITEMS_TEST_DATA.eggs,
            locationId: locations.fridge.id,
        };
        await insertItem(testItem);

        const [item] = await listItems();

        expect(item?.unit).toBeNull();
        expect(item?.expiresOn).toBeNull();
    });
});
