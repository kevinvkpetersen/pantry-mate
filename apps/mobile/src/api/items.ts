import type { PantryItem } from '@pantry-mate/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchItems = async (): Promise<PantryItem[]> => {
    const response = await fetch(`${API_URL}/items`);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()) as PantryItem[];
};
