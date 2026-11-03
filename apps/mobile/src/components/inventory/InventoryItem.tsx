import type { PantryItem } from '@pantry-mate/types';
import { StyleSheet, Text, View } from 'react-native';

import Badge from '@/components/Badge';
import useStyles from '@/hooks/useStyles';

const layout = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

const InventoryItem = ({ item }: { item: PantryItem }) => {
    const styles = useStyles();

    return (
        <View style={[layout.row, styles.card.base]}>
            <View>
                <Text style={styles.text.primary}>{item.name}</Text>
                <Text style={styles.text.detail}>
                    {item.quantity} {item.unit ?? ''}
                </Text>
            </View>
            {!!item.expiresOn && (
                <Badge text={`expires ${item.expiresOn}`} variant="fresh" />
            )}
        </View>
    );
};

export default InventoryItem;
