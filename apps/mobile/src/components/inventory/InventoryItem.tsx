import type { PantryItem } from '@pantry-mate/types';
import { Text, View } from 'react-native';

import useStyles from '@/hooks/useStyles';

const InventoryItem = ({ item }: { item: PantryItem }) => {
    const styles = useStyles();

    return (
        <View style={styles.text.surface}>
            <Text style={styles.text.primary}>{item.name}</Text>
            <Text style={styles.text.detail}>
                {item.quantity} {item.unit ?? ''}
                {item.expiresOn ? ` · expires ${item.expiresOn}` : ''}
            </Text>
        </View>
    );
};

export default InventoryItem;
