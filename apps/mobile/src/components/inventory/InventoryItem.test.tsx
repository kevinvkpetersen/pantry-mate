import { render, screen } from '@testing-library/react-native';

import { ITEMS_TEST_DATA } from '@/__tests__/fixtures';
import { expectNoNullishText } from '@/__tests__/utils';

import InventoryItem from './InventoryItem';

describe('InventoryItem', () => {
    afterEach(() => {
        expectNoNullishText();
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
        expect(
            screen.getByText(`expires ${testItem.expiresOn}`, { exact: false })
        ).toBeOnTheScreen();
    });

    it('renders without optional fields', async () => {
        const testItem = ITEMS_TEST_DATA.eggs;

        await render(<InventoryItem item={testItem} />);

        expect(screen.getByText(testItem.name)).toBeOnTheScreen();
        expect(
            screen.getByText(`${testItem.quantity}`, { exact: false })
        ).toBeOnTheScreen();

        expect(screen.queryByText('expires', { exact: false })).toBeNull();
    });
});
