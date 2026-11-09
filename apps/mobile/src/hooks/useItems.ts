import type { Item } from '@pantry-mate/types';
import { useEffect, useState } from 'react';

import { fetchItems } from '@/api/items';

export const useItems = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems()
            .then(setItems)
            .catch((e: unknown) => {
                setError(e instanceof Error ? e.message : 'Unknown error');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { items, error, loading };
};
