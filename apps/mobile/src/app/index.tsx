import type { PantryItem } from '@pantry-mate/types';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { fetchItems } from '@/api/items';

export default function Index() {
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

    if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
    if (error)
        return <Text style={{ padding: 24 }}>Failed to load: {error}</Text>;

    return (
        <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 24, gap: 12 }}
            renderItem={({ item }) => (
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>
                        {item.name}
                    </Text>
                    <Text>
                        {item.quantity} {item.unit ?? ''}
                        {item.expiresOn ? ` · expires ${item.expiresOn}` : ''}
                    </Text>
                </View>
            )}
        />
    );
}
