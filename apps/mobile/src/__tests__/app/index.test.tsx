import { screen } from '@testing-library/react-native';

import { ITEMS_TEST_DATA } from '@/__tests__/fixtures';
import { fetchItems } from '@/api/items';
import Index from '@/app/index';

import { expectNoNullishText, renderWithClient } from '../utils';

jest.mock('@/api/items', () => ({
    fetchItems: jest.fn(),
}));

describe('Index', () => {
    afterEach(() => {
        expectNoNullishText();
    });

    it('renders the inventory list', async () => {
        jest.mocked(fetchItems).mockResolvedValue([ITEMS_TEST_DATA.rice]);

        await renderWithClient(<Index />);

        expect(
            await screen.findByText(ITEMS_TEST_DATA.rice.name)
        ).toBeOnTheScreen();
    });
});
