import type { Item } from '@pantry-mate/types';
import { render, renderHook, screen } from '@testing-library/react-native';

import { ITEMS_TEST_DATA } from '@/__tests__/fixtures';
import { expectNoNullishText } from '@/__tests__/utils';
import type { BadgeVariant } from '@/hooks/useStyles';
import useStyles from '@/hooks/useStyles';

import InventoryItem from './InventoryItem';

// Fixed "today" for the expiry tests: 2024-06-15, local time
const NOW = new Date(2024, 5, 15, 12);

const expiringOn = (expiresOn: string): Item => ({
    ...ITEMS_TEST_DATA.rice,
    expiresOn,
});

// Loaded before any render, because renderHook replaces the rendered screen
let styles: ReturnType<typeof useStyles>;

const expectBadge = (text: string, variant: BadgeVariant) => {
    expect(screen.getByText(text)).toHaveStyle(
        styles.badge.variants[variant].text
    );
};

describe('InventoryItem', () => {
    beforeAll(async () => {
        const { result } = await renderHook(() => useStyles());
        styles = result.current;
    });

    beforeEach(() => {
        jest.useFakeTimers({ now: NOW });
    });

    afterEach(() => {
        expectNoNullishText();
        jest.useRealTimers();
    });

    it('renders with optional fields', async () => {
        const testItem = ITEMS_TEST_DATA.rice;

        await render(<InventoryItem item={testItem} />);

        expect(screen.getByText(testItem.name)).toBeOnTheScreen();
        expect(
            screen.getByText(`${testItem.quantity} ${testItem.unit}`, {
                exact: false,
            })
        ).toBeOnTheScreen();
    });

    it('renders without optional fields', async () => {
        const testItem = ITEMS_TEST_DATA.eggs;

        await render(<InventoryItem item={testItem} />);

        expect(screen.getByText(testItem.name)).toBeOnTheScreen();
        expect(
            screen.getByText(`${testItem.quantity}`, { exact: false })
        ).toBeOnTheScreen();
    });

    it('shows no badge without an expiry date', async () => {
        await render(<InventoryItem item={ITEMS_TEST_DATA.eggs} />);

        expect(screen.queryByText(/expire|days left/i)).toBeNull();
    });

    it('shows an expired badge for past dates', async () => {
        await render(<InventoryItem item={expiringOn('2024-06-14')} />);

        expectBadge('Expired', 'expired');
    });

    it.each([
        ['today', '2024-06-15', 'Expires today'],
        ['tomorrow', '2024-06-16', 'Expires tomorrow'],
        ['in 7 days', '2024-06-22', '7 days left'],
    ])('shows a warning badge when it expires %s', async (_, date, text) => {
        await render(<InventoryItem item={expiringOn(date)} />);

        expectBadge(text, 'warning');
    });

    it.each([
        ['in 8 days', '2024-06-23', '8 days left'],
        ['in 30 days', '2024-07-15', '30 days left'],
    ])(
        'shows a fresh badge with days left when it expires %s',
        async (_, date, text) => {
            await render(<InventoryItem item={expiringOn(date)} />);

            expectBadge(text, 'fresh');
        }
    );

    it('shows the expiry date when it is more than 30 days away', async () => {
        await render(<InventoryItem item={expiringOn('2024-07-16')} />);

        expectBadge('Expires 2024-07-16', 'fresh');
    });
});
