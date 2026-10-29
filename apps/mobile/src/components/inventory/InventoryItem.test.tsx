import { render, screen } from '@testing-library/react-native';

import InventoryItem from './InventoryItem';

describe('InventoryItem', () => {
    it('renders with optional fields', async () => {
        const testItem = {
            id: 1,
            name: 'Rice',
            locationId: 1,
            quantity: 2,
            unit: 'kg',
            expiresOn: '2024-12-31',
        };

        await render(<InventoryItem item={testItem} />);

        expect(screen.getByText(testItem.name)).toBeOnTheScreen();
        expect(
            screen.getByText(`${testItem.quantity} ${testItem.unit}`, {
                exact: false,
            })
        ).toBeOnTheScreen();
        expect(
            screen.getByText(`expires ${testItem.expiresOn}`, { exact: false })
        ).toBeOnTheScreen();

        expect(screen.queryByText('null', { exact: false })).toBeNull();
        expect(screen.queryByText('undefined', { exact: false })).toBeNull();
    });

    it('renders without optional fields', async () => {
        const testItem = {
            id: 2,
            name: 'Eggs',
            locationId: 2,
            quantity: 6,
            unit: null,
            expiresOn: null,
        };

        await render(<InventoryItem item={testItem} />);

        expect(screen.getByText(testItem.name)).toBeOnTheScreen();
        expect(
            screen.getByText(`${testItem.quantity}`, { exact: false })
        ).toBeOnTheScreen();

        expect(screen.queryByText('expires', { exact: false })).toBeNull();

        expect(screen.queryByText('null', { exact: false })).toBeNull();
        expect(screen.queryByText('undefined', { exact: false })).toBeNull();
    });
});
