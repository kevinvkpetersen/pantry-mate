import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';

export const expectNoNullishText = () => {
    expect(screen.queryByText('null', { exact: false })).toBeNull();
    expect(screen.queryByText('undefined', { exact: false })).toBeNull();
};

// A fresh client per test, so cached data doesn't leak between tests. No
// retries, so failing queries report their error straight away, and no cache
// garbage collection, whose 5-minute timer would keep Jest from exiting
export const renderWithClient = (ui: ReactElement) => {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: Infinity } },
    });

    return render(
        <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    );
};
