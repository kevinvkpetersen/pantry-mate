import type { PantryItem } from '@pantry-mate/types';
import { Text, View } from 'react-native';

const InventoryItem = ({ item }: { item: PantryItem }) => (
    <View>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
        <Text>
            {item.quantity} {item.unit ?? ''}
            {item.expiresOn ? ` · expires ${item.expiresOn}` : ''}
        </Text>
    </View>
);

export default InventoryItem;
