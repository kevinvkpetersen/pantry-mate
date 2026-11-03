import type { Item } from '@pantry-mate/types';
import { StyleSheet, Text, View } from 'react-native';

import Badge from '@/components/Badge';
import useStyles from '@/hooks/useStyles';
import { daysUntil, today } from '@/utils/dates';

const layout = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

const daysLeftText = (daysLeft: number) => {
    if (daysLeft === 0) return 'Expires today';
    if (daysLeft === 1) return 'Expires tomorrow';
    return `${daysLeft} days left`;
};

const getFreshnessBadge = (expiresOn: string | null) => {
    if (!expiresOn) return null;

    if (expiresOn < today()) {
        return <Badge text="Expired" variant="expired" />;
    }

    const daysLeft = daysUntil(expiresOn);
    if (daysLeft <= 7) {
        return <Badge text={daysLeftText(daysLeft)} variant="warning" />;
    }

    if (daysLeft <= 30) {
        return <Badge text={daysLeftText(daysLeft)} variant="fresh" />;
    }

    return <Badge text={`Expires ${expiresOn}`} variant="fresh" />;
};

const InventoryItem = ({ item }: { item: Item }) => {
    const styles = useStyles();

    return (
        <View style={[layout.row, styles.card.base]}>
            <View>
                <Text style={styles.text.primary}>{item.name}</Text>
                <Text style={styles.text.detail}>
                    {item.quantity} {item.unit ?? ''}
                </Text>
            </View>
            {getFreshnessBadge(item.expiresOn)}
        </View>
    );
};

export default InventoryItem;
