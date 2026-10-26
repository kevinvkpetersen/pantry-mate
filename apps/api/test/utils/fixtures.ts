import type { NewLocation } from '@pantry-mate/types';

export const LOCATIONS = {
    pantry: { name: 'Pantry' },
} as const satisfies Record<string, NewLocation>;
