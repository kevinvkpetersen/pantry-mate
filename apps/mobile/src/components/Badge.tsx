import { Text, View } from 'react-native';

import type { BadgeVariant } from '@/hooks/useStyles';
import { useStyles } from '@/hooks/useStyles';

const Badge = ({ text, variant }: { text: string; variant: BadgeVariant }) => {
    const { styles, variants } = useStyles().badge;

    return (
        <View style={[styles.base, variants[variant].view]}>
            <Text style={[styles.text, variants[variant].text]}>{text}</Text>
        </View>
    );
};

export default Badge;
