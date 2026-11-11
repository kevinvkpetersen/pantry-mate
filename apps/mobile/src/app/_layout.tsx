import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { useStyles } from '@/hooks/useStyles';

const queryClient = new QueryClient();

export default function RootLayout() {
    const { canvas } = useStyles();

    return (
        <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ contentStyle: canvas.background }} />
        </QueryClientProvider>
    );
}
