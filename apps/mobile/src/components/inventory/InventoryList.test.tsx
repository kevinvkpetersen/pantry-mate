import { render, screen } from '@testing-library/react-native';

import { ITEMS_TEST_DATA } from '@/__tests__/fixtures';
import { expectNoNullishText } from '@/__tests__/utils';
import { fetchItems } from '@/api/items';

import InventoryList from './InventoryList';

jest.mock('@/api/items', () => ({
    fetchItems: jest.fn(),
}));

describe('InventoryList', () => {
    afterEach(() => {
        expectNoNullishText();
    });

    it('renders fetched items', async () => {
        jest.mocked(fetchItems).mockResolvedValue(
            Object.values(ITEMS_TEST_DATA)
        );

        await render(<InventoryList />);

        expect(screen.getByText(ITEMS_TEST_DATA.rice.name)).toBeOnTheScreen();
        expect(screen.getByText(ITEMS_TEST_DATA.eggs.name)).toBeOnTheScreen();
    });

    it('renders error if fetch fails', async () => {
        jest.mocked(fetchItems).mockRejectedValue(
            new Error('TEST ERROR MESSAGE')
        );

        await render(<InventoryList />);

        expect(
            screen.getByText('Failed to load', { exact: false })
        ).toBeOnTheScreen();
        expect(
            screen.getByText('TEST ERROR MESSAGE', { exact: false })
        ).toBeOnTheScreen();
    });

    it('renders error if fetch fails with an unknown error', async () => {
        jest.mocked(fetchItems).mockRejectedValue('Non-error type');

        await render(<InventoryList />);

        expect(
            screen.getByText('Failed to load', { exact: false })
        ).toBeOnTheScreen();
        expect(
            screen.getByText('Unknown error', { exact: false })
        ).toBeOnTheScreen();
    });

    it('renders a loading indicator while waiting for the data', async () => {
        jest.mocked(fetchItems).mockReturnValue(new Promise(() => {}));

        await render(<InventoryList />);

        expect(screen.getByLabelText('Loading')).toBeOnTheScreen();
    });
});
