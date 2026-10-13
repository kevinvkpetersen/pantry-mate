import type { NewPantryItem } from '@pantry-mate/types';
import { beforeEach, describe, expect, it } from 'vitest';

import { listItems } from '../src/repositories/items';
import { clearItems, insertItem } from './utils/db';

const exampleItems: Record<string, NewPantryItem> = {
    rice: {
        name: 'Rice',
        quantity: 1,
        unit: 'kg',
        expiresOn: '2024-12-31',
    },
    eggs: {
        name: 'Eggs',
        quantity: 6,
        unit: null,
        expiresOn: null,
    },
};

describe('items repository', () => {
    beforeEach(async () => {
        await clearItems();
    });

    it('returns an empty list when there are no items', async () => {
        expect(await listItems()).toEqual([]);
    });

    it('returns a list of items if there are items', async () => {
        await insertItem(exampleItems.rice);

        const fetchedItems = await listItems();

        expect(fetchedItems).toEqual([
            {
                id: 1,
                ...exampleItems.rice,
            },
        ]);
    });

    it('returns null for a missing unit and a missing expiry date', async () => {
        await insertItem(exampleItems.eggs);

        const [item] = await listItems();

        expect(item?.unit).toBeNull();
        expect(item?.expiresOn).toBeNull();
    });
});
