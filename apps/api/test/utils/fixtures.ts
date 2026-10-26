import type { NewLocation, NewPantryItem } from '@pantry-mate/types';

import { insertLocation } from './db';

export const LOCATIONS_TEST_DATA = {
    pantry: { name: 'Pantry' },
    fridge: { name: 'Fridge' },
} as const satisfies Record<string, NewLocation>;

type ItemTestData = Omit<NewPantryItem, 'locationId'>;
export const ITEMS_TEST_DATA = {
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
} satisfies Record<string, ItemTestData>;

const insertAll = async <K extends string, F, R>(
    fixtures: Record<K, F>,
    insert: (fixture: F) => Promise<R>
): Promise<Record<K, R>> => {
    const data = {} as Record<K, R>;

    for (const key of Object.keys(fixtures) as K[]) {
        data[key] = await insert(fixtures[key]);
    }

    return data;
};

export const loadBaseline = async () => {
    const locations = await insertAll(LOCATIONS_TEST_DATA, (l) =>
        insertLocation(l)
    );
    return { locations };
};
