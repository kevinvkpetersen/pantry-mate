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
});
