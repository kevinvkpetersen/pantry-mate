import { Stack } from 'expo-router';

import useStyles from '@/hooks/useStyles';

export default function RootLayout() {
    const { canvas } = useStyles();

    return <Stack screenOptions={{ contentStyle: canvas.background }} />;
}
