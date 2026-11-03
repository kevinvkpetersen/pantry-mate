import type { Item } from '@pantry-mate/types';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';

import { fetchItems } from '@/api/items';
import InventoryItem from '@/components/inventory/InventoryItem';
import useStyles from '@/hooks/useStyles';

const InventoryList = () => {
    const styles = useStyles();

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
            contentContainerStyle={styles.card.list}
            renderItem={({ item }) => <InventoryItem item={item} />}
        />
    );
};

export default InventoryList;
