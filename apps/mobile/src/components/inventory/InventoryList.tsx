import { ActivityIndicator, FlatList, Text } from 'react-native';

import InventoryItem from '@/components/inventory/InventoryItem';
import { useItems } from '@/hooks/useItems';
import { useStyles } from '@/hooks/useStyles';

const InventoryList = () => {
    const { items, error, loading } = useItems();
    const styles = useStyles();

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
