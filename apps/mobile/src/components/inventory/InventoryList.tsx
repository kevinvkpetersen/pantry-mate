import type { PantryItem } from '@pantry-mate/types';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';

import { fetchItems } from '@/api/items';
import InventoryItem from '@/components/inventory/InventoryItem';

const InventoryList = () => {
    const [items, setItems] = useState<PantryItem[]>([]);
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

    if (loading)
        return (
            <ActivityIndicator
                style={{ flex: 1 }}
                accessibilityLabel="Loading"
            />
        );
    if (error)
        return <Text style={{ padding: 24 }}>Failed to load: {error}</Text>;

    return (
        <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 24, gap: 12 }}
            renderItem={({ item }) => <InventoryItem item={item} />}
        />
    );
};

export default InventoryList;
