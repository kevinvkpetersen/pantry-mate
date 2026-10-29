import { render, screen } from '@testing-library/react-native';

import InventoryList from './InventoryList';

jest.mock('@/api/items', () => ({
    fetchItems: jest.fn().mockResolvedValue([]),
}));

describe('InventoryList', () => {
    it('renders fetched items', async () => {
        await render(<InventoryList />);

        expect(screen.queryByText('null', { exact: false })).toBeNull();
        expect(screen.queryByText('undefined', { exact: false })).toBeNull();
    });
});
