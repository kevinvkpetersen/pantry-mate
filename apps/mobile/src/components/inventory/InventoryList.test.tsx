import { render, screen } from '@testing-library/react-native';

import { ITEMS_TEST_DATA } from '@/__tests__/fixtures';
import { fetchItems } from '@/api/items';

import InventoryList from './InventoryList';

jest.mock('@/api/items', () => ({
    fetchItems: jest.fn().mockResolvedValue([]),
}));

describe('InventoryList', () => {
    it('renders fetched items', async () => {
        jest.mocked(fetchItems).mockResolvedValue([ITEMS_TEST_DATA.rice]);

        await render(<InventoryList />);

        expect(screen.queryByText('null', { exact: false })).toBeNull();
        expect(screen.queryByText('undefined', { exact: false })).toBeNull();
    });
});
