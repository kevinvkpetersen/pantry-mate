import { beforeEach, describe, expect, it } from 'vitest';

import { listLocations } from '../src/repositories/locations';
import { clearDatabase, insertLocation } from './utils/db';
import { LOCATIONS } from './utils/fixtures';

describe('Locations', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    it('should return an empty list when there are no locations', async () => {
        const fetchedLocations = await listLocations();

        expect(fetchedLocations).toEqual([]);
    });

    it('should return a list of locations if there are any', async () => {
        await insertLocation(LOCATIONS.pantry);

        const fetchedLocations = await listLocations();

        expect(fetchedLocations).toEqual([
            {
                ...LOCATIONS.pantry,
                id: 1,
            },
        ]);
    });
});
