import { Text, View } from 'react-native';

import useStyles from '@/hooks/useStyles';

const Badge = ({ text }: { text: string }) => {
    const styles = useStyles().badge;

    return (
        <View style={styles.base}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

export default Badge;
