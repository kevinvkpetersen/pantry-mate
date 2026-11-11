import { screen } from '@testing-library/react-native';

import { ITEMS_TEST_DATA } from '@/__tests__/fixtures';
import { expectNoNullishText, renderWithClient } from '@/__tests__/utils';
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

        await renderWithClient(<InventoryList />);

        expect(
            await screen.findByText(ITEMS_TEST_DATA.rice.name)
        ).toBeOnTheScreen();
        expect(screen.getByText(ITEMS_TEST_DATA.eggs.name)).toBeOnTheScreen();
    });

    it('renders error if fetch fails', async () => {
        jest.mocked(fetchItems).mockRejectedValue(
            new Error('TEST ERROR MESSAGE')
        );

        await renderWithClient(<InventoryList />);

        expect(
            await screen.findByText('Failed to load', { exact: false })
        ).toBeOnTheScreen();
        expect(
            screen.getByText('TEST ERROR MESSAGE', { exact: false })
        ).toBeOnTheScreen();
    });

    it('renders a loading indicator while waiting for the data', async () => {
        jest.mocked(fetchItems).mockReturnValue(new Promise(() => {}));

        await renderWithClient(<InventoryList />);

        expect(screen.getByLabelText('Loading')).toBeOnTheScreen();
    });
});
