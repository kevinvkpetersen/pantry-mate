import type { PantryItem } from '@pantry-mate/types';

export const ITEMS_TEST_DATA = {
    rice: {
        id: 1,
        name: 'Rice',
        locationId: 1,
        quantity: 2,
        unit: 'kg',
        expiresOn: '2024-12-31',
    },
    eggs: {
        id: 2,
        name: 'Eggs',
        locationId: 2,
        quantity: 6,
        unit: null,
        expiresOn: null,
    },
} satisfies Record<string, PantryItem>;
